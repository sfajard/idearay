// lib/schema.ts
import * as z from "zod";

export const postSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Konten postingan tidak boleh kosong." }),
  images: z
    .array(
      z
        .instanceof(File)
        .refine((file) => file.size > 0, {
          message: "Berkas gambar tidak boleh kosong.",
        })
        .refine((file) => file.size <= 5 * 1024 * 1024, {
          message: "Ukuran gambar tidak boleh lebih dari 5MB.",
        })
        .refine(
          (file) =>
            ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
              file.type
            ),
          {
            message: "Format gambar harus JPEG, PNG, GIF, atau WebP.",
          }
        )
    )
    .optional(),
  imageUrls: z.array(z.string().url("URL gambar tidak valid.")).optional(),
});