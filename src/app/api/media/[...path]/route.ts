import { NextRequest, NextResponse } from 'next/server';
import S3 from 'aws-sdk/clients/s3.js';
import { Readable } from 'stream';

const r2 = new S3({
  endpoint: process.env.R2_ENDPOINT,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
  region: 'auto',
});

function nodeStreamToWebStream(stream: Readable): ReadableStream {
  return new ReadableStream({
    start(controller) {
      stream.on('data', chunk => controller.enqueue(chunk));
      stream.on('end', () => controller.close());
      stream.on('error', err => controller.error(err));
    },
    cancel() {
      stream.destroy();
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params;
  const key = pathSegments.join('/');

  if (!key.startsWith('templates/')) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const bucket = process.env.R2_BUCKET_NAME || 'saywith-data';
  const range = request.headers.get('range');

  try {
    const head = await r2.headObject({ Bucket: bucket, Key: key }).promise();
    const contentType = head.ContentType || (key.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg');
    const totalSize = head.ContentLength || 0;

    if (range && totalSize > 0) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;
      const chunkSize = end - start + 1;

      const nodeStream = r2.getObject({
        Bucket: bucket,
        Key: key,
        Range: `bytes=${start}-${end}`,
      }).createReadStream();

      return new NextResponse(nodeStreamToWebStream(nodeStream), {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${totalSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize.toString(),
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    const nodeStream = r2.getObject({ Bucket: bucket, Key: key }).createReadStream();
    return new NextResponse(nodeStreamToWebStream(nodeStream), {
      status: 200,
      headers: {
        'Content-Length': totalSize.toString(),
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err: any) {
    return new NextResponse(`Object not found in R2: ${err.message}`, { status: 404 });
  }
}
