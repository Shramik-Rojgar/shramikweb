import { supabase } from './supabase';

const BUCKET = 'shramikfiles';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const ALLOWED_DOC_TYPES   = [...ALLOWED_IMAGE_TYPES, 'application/pdf'];
const MAX_IMAGE_BYTES      = 5 * 1024 * 1024;  // 5 MB
const MAX_DOC_BYTES        = 10 * 1024 * 1024; // 10 MB

export function validateImageFile(file) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type))
    throw new Error('Only JPG, PNG, or WebP images are allowed for photos.');
  if (file.size > MAX_IMAGE_BYTES)
    throw new Error('Photo must be smaller than 5 MB.');
}

export function validateDocFile(file) {
  if (!ALLOWED_DOC_TYPES.includes(file.type))
    throw new Error('Only JPG, PNG, WebP, or PDF files are allowed for ID documents.');
  if (file.size > MAX_DOC_BYTES)
    throw new Error('Document must be smaller than 10 MB.');
}

/**
 * Upload a file to Supabase Storage and return its public URL.
 * File is stored as {folder}/{workerId}.{ext}
 */
export async function uploadFile(file, folder, workerId) {
  const ext  = file.name.split('.').pop().toLowerCase().replace(/[^a-z0-9]/g, '');
  const path = `${folder}/${workerId}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
