
import S3 from 'aws-sdk/clients/s3';

const R2 = new S3({
  endpoint: process.env.R2_ENDPOINT,
  accessKeyId: `${process.env.R2_ACCESS_KEY_ID}`,
  secretAccessKey: `${process.env.R2_SECRET_ACCESS_KEY}`,
  signatureVersion: 'v4',
  region: 'auto',
});

export async function getSignedUrl(filePath: string): Promise<string> {
    if (!filePath) {
        throw new Error('File path is required');
    }

    const params = {
        Bucket: process.env.R2_BUCKET_NAME,
        Key: filePath,
        Expires: 60 * 60 * 24 * 7, // 7 days
    };

    try {
        const url = await R2.getSignedUrlPromise('getObject', params);
        return url;
    } catch (error) {
        console.error('Error generating signed URL from R2:', error);
        throw new Error('Could not generate signed URL');
    }
}
