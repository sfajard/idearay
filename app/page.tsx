"use client";

import { useEffect, useState } from "react";
import { PostCard } from "@/components/post/post-card";
import { CreatePostForm } from "@/components/post/create-post";
import { Separator } from "@/components/ui/separator";
import { Post, User } from "@prisma/client";
import { createPost, getAllPosts } from "@/lib/actions/post";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

interface PostWithUser extends Post {
  user: Pick<User, 'name' | 'image' | 'id'>
}

export default function Feed() {
  const [posts, setPosts] = useState<PostWithUser[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const { data: session } = useSession()

  const handleNewPost = async (content: string) => {
    if (!session?.user) {
      redirect('/signin')
    }

    if (!content) {
      return 'Content required'
    }

    if (session.user.id) {
      const response = await createPost(content, session.user.id)
      console.log("Post created: ", response)
    }
  }

  const onDelete = () => {
    loadPosts()
  }

  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await getAllPosts()
      if (response && Array.isArray(response)) {
        const sortedPosts = response.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setPosts(sortedPosts as PostWithUser[])
      } else {
        setPosts([])
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts()
  }, [])

  return (
    <div className="w-full flex items-center justify-center">
      <div className="wflex min-h-screen w-135 flex-col items-center p-8 bg-gray-50">
        <CreatePostForm onSuccess={loadPosts} onPostSubmit={handleNewPost} />
        <Separator className="mb-6" />
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id}
              id={post.id}
              userId={post.userId}
              username={post.user.name ?? '-'}
              avatarUrl={post.user.image ?? 'https://github.com/shadcn.png'}
              content={post.content}
              timestamp={post.createdAt.toISOString()}
              onSuccess={loadPosts}
            />
          ))}
        </div>
      </div>
    </div>
  );
}