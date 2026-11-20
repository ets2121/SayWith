import fs from 'fs';
import path from 'path';
import S3 from 'aws-sdk/clients/s3.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Helper to load .env variables
function loadEnv() {
  const envFiles = ['.env', '.env.local', '.env.production'];
  const env = {};
  for (const ef of envFiles) {
    const p = path.join(projectRoot, ef);
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const idx = trimmed.indexOf('=');
          const k = trimmed.substring(0, idx).trim();
          const v = trimmed.substring(idx + 1).trim();
          if (!env[k]) env[k] = v;
        }
      }
    }
  }
  return env;
}

const env = loadEnv();

// Parse CLI args
const args = process.argv.slice(2);
let customDomain = '';
let isDryRun = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--domain' || args[i] === '--public-url' || args[i] === '-u') {
    customDomain = args[i + 1]?.trim().replace(/\/+$/, '') || '';
    i++;
  } else if (args[i] === '--dry-run') {
    isDryRun = true;
  }
}

// Fallback domain priority: CLI arg -> NEXT_PUBLIC_R2_DOMAIN -> R2_PUBLIC_DOMAIN -> check if R2_PUBLIC_URL is a public CDN
let publicBaseUrl = customDomain || env.NEXT_PUBLIC_R2_DOMAIN || env.R2_PUBLIC_DOMAIN || '';

// If R2_PUBLIC_URL contains r2.cloudflarestorage.com, that is the private S3 API endpoint, not a public browser CDN
if (!publicBaseUrl && env.R2_PUBLIC_URL && !env.R2_PUBLIC_URL.includes('r2.cloudflarestorage.com')) {
  publicBaseUrl = env.R2_PUBLIC_URL;
}

publicBaseUrl = publicBaseUrl.replace(/\/+$/, '');

const R2_BUCKET = env.R2_BUCKET_NAME || 'saywith-data';
const R2_ENDPOINT = env.R2_ENDPOINT;
const R2_ACCESS_KEY_ID = env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = env.R2_SECRET_ACCESS_KEY;

if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.error('❌ Error: Missing R2 credentials in .env (R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY)');
  process.exit(1);
}

const r2 = new S3({
  endpoint: R2_ENDPOINT,
  accessKeyId: R2_ACCESS_KEY_ID,
  secretAccessKey: R2_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
  region: 'auto',
});

console.log('☁️  Cloudflare R2 Automation Uploader for SayWith Templates');
console.log(`📦 Target Bucket : ${R2_BUCKET}`);
console.log(`🌐 Public Base   : ${publicBaseUrl || '(Not specified, will use relative or provide placeholder)'}`);
if (isDryRun) console.log('⚠️  Mode          : DRY RUN (no files will be uploaded)');

// Find template assets
const localAssetsDir = path.resolve(projectRoot, 'public', 'templates');
const videosDir = path.join(localAssetsDir, 'videos');
const thumbsDir = path.join(localAssetsDir, 'thumbnails');

if (!fs.existsSync(videosDir) || !fs.existsSync(thumbsDir)) {
  console.error(`❌ Error: Template directories not found at ${localAssetsDir}`);
  process.exit(1);
}

const videoFiles = fs.readdirSync(videosDir).filter(f => f.endsWith('.mp4')).sort();
const thumbFiles = fs.readdirSync(thumbsDir).filter(f => f.endsWith('.jpg')).sort();

console.log(`📹 Found ${videoFiles.length} template videos`);
console.log(`🖼️  Found ${thumbFiles.length} template thumbnails`);

const tasks = [];

for (const vf of videoFiles) {
  const filePath = path.join(videosDir, vf);
  const r2Key = `templates/videos/${vf}`;
  tasks.push({
    type: 'video',
    filename: vf,
    localPath: filePath,
    r2Key,
    contentType: 'video/mp4',
    size: fs.statSync(filePath).size,
  });
}

for (const tf of thumbFiles) {
  const filePath = path.join(thumbsDir, tf);
  const r2Key = `templates/thumbnails/${tf}`;
  tasks.push({
    type: 'thumbnail',
    filename: tf,
    localPath: filePath,
    r2Key,
    contentType: 'image/jpeg',
    size: fs.statSync(filePath).size,
  });
}

// Concurrency helper
async function pool(items, concurrency, fn) {
  const results = [];
  const executing = [];
  let index = 0;
  for (const item of items) {
    const p = Promise.resolve().then(() => fn(item, ++index, items.length));
    results.push(p);
    if (concurrency <= items.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= concurrency) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(results);
}

async function uploadFile(task, idx, total) {
  const sizeKB = (task.size / 1024).toFixed(1);
  if (isDryRun) {
    console.log(`[${idx}/${total}] [DRY-RUN] ${task.r2Key} (${sizeKB} KB)`);
    return { success: true, key: task.r2Key };
  }

  const fileStream = fs.createReadStream(task.localPath);
  const params = {
    Bucket: R2_BUCKET,
    Key: task.r2Key,
    Body: fileStream,
    ContentType: task.contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  };

  try {
    await r2.upload(params).promise();
    console.log(`[${idx}/${total}] ✅ Uploaded: ${task.r2Key} (${sizeKB} KB)`);
    return { success: true, key: task.r2Key };
  } catch (err) {
    console.error(`[${idx}/${total}] ❌ Failed to upload ${task.r2Key}:`, err.message);
    return { success: false, key: task.r2Key, error: err.message };
  }
}

async function main() {
  const startTime = Date.now();
  console.log(`\n🚀 Starting upload of ${tasks.length} files (concurrency = 6)...\n`);
  
  const results = await pool(tasks, 6, uploadFile);
  const succeeded = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`\n✨ Upload finished in ${elapsed}s!`);
  console.log(`   - Succeeded: ${succeeded}`);
  console.log(`   - Failed:    ${failed}`);

  if (failed > 0) {
    console.warn(`⚠️ Warning: ${failed} files failed to upload.`);
  }

  // Update templates.json
  const templatesJsonPath = path.join(projectRoot, 'public', 'data', 'templates.json');
  if (fs.existsSync(templatesJsonPath)) {
    console.log(`\n🔄 Updating ${templatesJsonPath} with URLs...`);
    const templates = JSON.parse(fs.readFileSync(templatesJsonPath, 'utf-8'));

    // If public base URL is provided, format: ${publicBaseUrl}/templates/videos/...
    // If not provided, it keeps the local /templates/videos/... or uses the R2 public path
    const urlPrefix = publicBaseUrl ? `${publicBaseUrl}/templates` : '/templates';

    for (const t of templates) {
      const num = t.num;
      const vName = `template-${String(num).padStart(2, '0')}.mp4`;
      const tName = `template-${String(num).padStart(2, '0')}.jpg`;

      t.previewType = 'video';
      t.previewUrl = `${urlPrefix}/videos/${vName}`;
      t.posterUrl = `${urlPrefix}/thumbnails/${tName}`;
    }

    fs.writeFileSync(templatesJsonPath, JSON.stringify(templates, null, 2), 'utf-8');
    console.log(`✅ Successfully updated all ${templates.length} templates in templates.json!`);
    console.log(`   Sample preview URL: ${templates[0].previewUrl}`);
    console.log(`   Sample poster URL : ${templates[0].posterUrl}`);
  }

  // Also update upload_manifest.json in assets
  const manifestPath = path.resolve(projectRoot, '..', 'assets', 'cloudflare_templates', 'upload_manifest.json');
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    for (const m of manifest) {
      const num = m.templateNum;
      const vName = `template-${String(num).padStart(2, '0')}.mp4`;
      const tName = `template-${String(num).padStart(2, '0')}.jpg`;
      m.r2VideoUrl = publicBaseUrl ? `${publicBaseUrl}/templates/videos/${vName}` : m.r2VideoUrl;
      m.r2ThumbnailUrl = publicBaseUrl ? `${publicBaseUrl}/templates/thumbnails/${tName}` : m.r2ThumbnailUrl;
      m.uploadedAt = new Date().toISOString();
      m.bucket = R2_BUCKET;
    }
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
    console.log(`✅ Updated manifest at ${manifestPath}`);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
