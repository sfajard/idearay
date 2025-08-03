'use server';

import { put } from '@vercel/blob'

export async function uploadImageToServer(file: File): Promise<string | { error: string }> {
  try {
    const filename = `${file.name.split(".")[0]}-${Date.now()}.${file.name.split(".").pop()}`

    const { url } = await put(filename, file, { access: 'public' });
    return url
  } catch (error) {
    console.error(error)
    return { error: "Failed to upload image." }
  }
}