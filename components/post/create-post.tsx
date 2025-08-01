"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface CreatePostFormProps {
  onPostSubmit: (content: string) => void;
  onSuccess: () => void;
}

export function CreatePostForm({ onPostSubmit, onSuccess }: CreatePostFormProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault();
    if (content.trim()) {
      onPostSubmit(content);
      setContent("");
    }
    setLoading(false)
    onSuccess()
  };

  return (
    <Card className="mb-6 w-full md:w-lg">
      <CardHeader>
        <h2 className="text-lg font-semibold">Buat Postingan Baru</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Textarea disabled={loading}
            placeholder="Apa yang ada di pikiranmu?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mb-4"
            rows={4}
          />
          <Button type="submit" disabled={loading} className="w-full">Post</Button>
        </form>
      </CardContent>
    </Card>
  );
}