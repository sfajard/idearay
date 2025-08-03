'use client'

import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { FaRegHeart, FaHeart, FaRegComment } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { EllipsisVertical } from "lucide-react";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { deletePost } from "@/lib/actions/post";
import { Comment, Image, Like, User } from "@prisma/client";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce"
import { createLike, deleteLike } from "@/lib/actions/like";
import CommentDrawer from "./comment-drawer";
import { Skeleton } from "../ui/skeleton";
import { PostImage } from "./post-image";

interface CommentWithUser extends Comment {
    user: User
}

interface PostCardProps {
    id: string;
    userId: string;
    username: string;
    avatarUrl: string;
    content: string;
    timestamp: string;
    Like: Like[]
    image?: Image[]
    comment: CommentWithUser[]
    onSuccess: () => void
}

export const PostCardSkeleton = () => (
    <Card className="w-full max-w-2xl p-6 rounded-lg shadow-md animate-pulse mb-6">
        <CardHeader className="flex flex-row items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/6" />
            </div>
        </CardHeader>
        <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-3/4" />
        </CardContent>
        <CardFooter className="mt-4 flex items-center space-x-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
        </CardFooter>
    </Card>
)

export function PostCard({ username, avatarUrl, content, timestamp, userId, id, Like, comment, image, onSuccess }: PostCardProps) {
    const { data: session } = useSession()
    const user = session?.user
    const isOwner = session?.user.id === userId
    const initialLikedRef = useRef(Like.some(like => like.userId === session?.user?.id))
    const initialLiked = Like.some(like => like.userId === session?.user?.id)
    const [liked, setLiked] = useState<boolean>(initialLiked)
    const initialLikeCount = Like.length
    const [likeCount, setLikeCount] = useState<number>(initialLikeCount)
    const commentCount = comment.length

    const [debouncedLike] = useDebounce(liked, 1000)

    const handleDelete = async () => {
        deletePost(id)
        onSuccess()
    }

    const handleLike = () => {
        if (!session?.user) {
            redirect('/signin')
        }

        setLiked(prevLike => !prevLike)
        setLikeCount(prevCount => prevCount + (liked ? -1 : 1))
    }
    if (!image) return
    const isImageNotEmpty = image?.length >= 1
    useEffect(() => {
        if (!user?.id) return
        if (debouncedLike !== initialLikedRef.current) {
            if (debouncedLike === true) {
                createLike(user.id, id)
                console.log('created (via useEffect)')
            } else {
                deleteLike(user.id, id)
                console.log('deleted (via useEffect)')
            }

            initialLikedRef.current = debouncedLike;
        }
    }, [debouncedLike, user?.id, id]);

    return (
        <Card className="w-full md:w-xl">
            <CardHeader className="flex flex-row items-center">
                <div className="flex justify-between w-full">
                    <div className="flex items-center">
                        <Avatar className="">
                            <AvatarImage src={avatarUrl} alt={username} />
                            <AvatarFallback>{username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="ml-1">
                            <p className="font-semibold">{username}</p>
                            <p className="text-sm text-gray-500">{new Date(timestamp).toLocaleString()}</p>
                        </div>
                    </div>
                    {isOwner && (
                        <div>
                            <Popover>
                                <PopoverTrigger><EllipsisVertical /></PopoverTrigger>
                                <PopoverContent className="flex flex-col max-w-sm">
                                    <Button variant={'ghost'} onClick={handleDelete}>Delete</Button>
                                    <Button variant={'ghost'}>Edit</Button>
                                </PopoverContent>
                            </Popover>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="flex flex-col">
                <p>{content}</p>
                {isImageNotEmpty && (
                    <PostImage images={image} />
                )}
            </CardContent>
            <CardFooter>
                <Button onClick={handleLike} size={'icon'} variant={'ghost'} className="cursor-pointer">
                    {liked ? (
                        <>
                            <FaHeart />
                            <p className="text-sm text-gray-400">{likeCount}</p>
                        </>
                    ) : (
                        <>
                            <FaRegHeart />
                            <p className="text-sm text-gray-400">{likeCount}</p>
                        </>
                    )}

                </Button>
                {session?.user ? (
                    <CommentDrawer onSuccess={onSuccess} postId={id} comments={comment} session={session} commentButton={
                        <Button variant={'ghost'} size={'icon'} className="cursor-pointer ml-2">
                            <FaRegComment /><p className="text-sm text-gray-400">{commentCount}</p>
                        </Button>
                    } />
                ) : (
                    <Button variant={'ghost'} size={'icon'} className="cursor-pointer ml-2">
                        <FaRegComment /><p className="text-sm text-gray-400">{commentCount}</p>
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}