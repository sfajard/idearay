'use client'

import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { EllipsisVertical } from "lucide-react";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { deletePost } from "@/lib/actions/post";
import { Like } from "@prisma/client";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce"
import { createLike, deleteLike } from "@/lib/actions/like";

interface PostCardProps {
    id: string;
    userId: string;
    username: string;
    avatarUrl: string;
    content: string;
    timestamp: string;
    Like: Like[]
    onSuccess: () => void
}

export function PostCard({ username, avatarUrl, content, timestamp, userId, id, Like, onSuccess }: PostCardProps) {
    const { data: session } = useSession()
    const user = session?.user
    const isOwner = session?.user.id === userId
    const initialLikedRef = useRef(Like.some(like => like.userId === session?.user?.id))
    const initialLiked = Like.some(like => like.userId === session?.user?.id)
    const [liked, setLiked] = useState<boolean>(initialLiked)
    const initialLikeCount = Like.length
    const [likeCount, setLikeCount] = useState<number>(initialLikeCount)

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
        <Card className="w-full md:w-lg">
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
            <CardContent className="">
                <p>{content}</p>
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
            </CardFooter>
        </Card>
    );
}