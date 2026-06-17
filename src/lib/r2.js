import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const accountId       = import.meta.env.VITE_R2_ACCOUNT_ID;
const accessKeyId     = import.meta.env.VITE_R2_ACCESS_KEY_ID;
const secretAccessKey = import.meta.env.VITE_R2_SECRET_ACCESS_KEY;
const bucketName      = import.meta.env.VITE_R2_BUCKET_NAME;
const publicUrl       = import.meta.env.VITE_R2_PUBLIC_URL?.replace(/\/$/, '');

// R2 is S3-compatible — endpoint format: https://<account_id>.r2.cloudflarestorage.com
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

/**
 * Upload a File object to R2 and return the public CDN URL.
 *
 * @param {File}   file       - The file to upload.
 * @param {string} folder     - Folder prefix inside the bucket (e.g. 'photos', 'gov-ids').
 * @param {string} userId     - Used to namespace the file path.
 * @returns {Promise<string>} - Public CDN URL of the uploaded file.
 */
export async function uploadToR2(file, folder, userId) {
  const ext      = file.name.split('.').pop();
  const key      = `${folder}/${userId}_${Date.now()}.${ext}`;
  const buffer   = await file.arrayBuffer();

  await r2Client.send(
    new PutObjectCommand({
      Bucket:      bucketName,
      Key:         key,
      Body:        new Uint8Array(buffer),
      ContentType: file.type,
    })
  );

  return `${publicUrl}/${key}`;
}
