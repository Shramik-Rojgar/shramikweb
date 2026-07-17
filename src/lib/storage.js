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
 * Upload a file to Supabase Storage and return its storage PATH.
 *
 * The path key is a random UUID, never the owner's phone number: the bucket
 * holds government IDs, and a guessable key made them retrievable by anyone who
 * knew a phone number. Callers store the returned path and exchange it for a
 * short-lived signed URL at render time via getSignedUrl().
 *
 * upsert is off — a UUID key cannot collide, so a conflict means a bug worth
 * surfacing rather than silently overwriting someone's document. It also has to
 * stay off: the bucket's RLS grants INSERT only, so an upsert that tried to
 * replace an existing object would be denied outright.
 */
export async function uploadFile(file, folder) {
  const ext  = file.name.split('.').pop().toLowerCase().replace(/[^a-z0-9]/g, '');
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: false, contentType: file.type });

  if (error) throw new Error(error.message);

  return path;
}

/**
 * Exchange a stored path for a signed URL. Returns null for empty input so
 * callers can pass a possibly-absent column straight through.
 */
export async function getSignedUrl(path, expiresIn = 300) {
  if (!path) return null;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, expiresIn);

  if (error) throw new Error(error.message);
  return data.signedUrl;
}
