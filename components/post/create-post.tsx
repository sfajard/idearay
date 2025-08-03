"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { postSchema } from "@/lib/schema";
import { PlusCircle, XCircle } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { createPost } from "@/lib/actions/post";
import { put } from "@vercel/blob";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { uploadImageToServer } from "@/lib/actions/image";

interface CreatePostFormProps {
  onSuccess: () => void;
}

export function CreatePostForm({ onSuccess }: CreatePostFormProps) {
  const [loading, setLoading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const { data: session } = useSession()
  const router = useRouter()

  const MAX_IMAGES = 4


  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: '',
      imageUrls: []
    }
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      const imageFiles = files.filter(file => file.type.startsWith('image/'))

      const remainingSlots = MAX_IMAGES - selectedFiles.length;
      if (remainingSlots <= 0) {
        alert(`Anda hanya dapat mengunggah hingga ${MAX_IMAGES} gambar.`);
        e.target.value = '';
        return;
      }

      const filesToAdd = imageFiles.slice(0, remainingSlots);

      setSelectedFiles((prevPreviews) => [...prevPreviews, ...imageFiles])

      filesToAdd.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreviews((prevPreviews) => [...prevPreviews, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });

      e.target.value = ''
    }
  }

  const handleRemoveImage = (indexToRemove: number) => {
    setImagePreviews((prevPreviews) => prevPreviews.filter((_, index) => index !== indexToRemove))
    setSelectedFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove))
  }

  const onSubmit = async (data: z.infer<typeof postSchema>) => {
    console.log('sddaw')
    setLoading(true)

    if (!session?.user.id) {
      router.push('/singin')
      return
    }

    try {
      let uploadedImageUrls: string[] = [];

      if (selectedFiles.length > 0) {
        const uploadPromises = selectedFiles.map(async (file) => {
          const response = await uploadImageToServer(file)
          return response
        });

        const uploadResults = await Promise.all(uploadPromises)

        uploadedImageUrls = uploadResults.filter((result): result is string => typeof result === 'string')
      }

      createPost(data.content, session?.user.id, uploadedImageUrls)
      form.reset();
      setSelectedFiles([])
      setImagePreviews([])
      onSuccess()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  };

  return (
    <Card className="mb-6 w-full md:w-xl">
      <CardHeader>
        <h2 className="text-lg font-semibold">Buat Postingan Baru</h2>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konten</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Apa yang ada di pikiranmu?"
                      className="mb-4"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mb-4">
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
                disabled={loading}
              />
              <label
                htmlFor="image-upload"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Pilih Gambar
              </label>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
                {imagePreviews.map((src, index) => (
                  <div key={index} className="relative group overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={src}
                      alt={`Pratinjau ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      onClick={() => handleRemoveImage(index)}
                      disabled={loading}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Memposting..." : "Post"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}