import { supabase } from './supabase';

const BUCKET = 'shramikfiles';

/**
 * Upload a file to Supabase Storage and return its public URL.
 * File is stored as  {folder}/{workerId}.{ext}
 */
export async function uploadFile(file, folder, workerId) {
  const ext  = file.name.split('.').pop().toLowerCase();
  const path = `${folder}/${workerId}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
