import React, { useState } from 'react'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Input } from '../ui/input'
import { Session } from 'next-auth'
import { FaArrowRight } from 'react-icons/fa'
import { Comment, User } from '@prisma/client'
import { createComment, deleteComment } from '@/lib/actions/comment'
import { redirect } from 'next/navigation'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { EllipsisVertical } from 'lucide-react'
import { Separator } from '../ui/separator'
import { Skeleton } from '../ui/skeleton'

interface CommentWithUser extends Comment {
    user: User
}

interface CommentDrawerProps {
    commentButton: React.ReactNode,
    session: Session
    postId: string
    comments: CommentWithUser[]
    onSuccess: () => void
}

const CommentDrawer = ({ commentButton, session, comments, postId, onSuccess }: CommentDrawerProps) => {
    const [commentText, setCommentText] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        if (!session.user.id) {
            redirect('/signin')
        }
        await createComment(session.user.id, postId, commentText)
        onSuccess()
        setIsLoading(false)
        setCommentText('')
    }

    const handleDelete = async (id: string) => {
        setIsLoading(true)
        await deleteComment(id)
        onSuccess()
        setIsLoading(false)
    }

    const isCommentEmpty = comments.length < 1

    return (
        <Drawer>
            <DrawerTrigger asChild>{commentButton}</DrawerTrigger>
            <DrawerContent className='min-h-1/2'>
                {isLoading ? (
                    <div className="p-4 space-y-4">
                        <Skeleton className="h-10 w-3/4 mx-auto" />
                        <div className="flex items-center space-x-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[200px]" />
                                <Skeleton className="h-4 w-[250px]" />
                            </div>
                        </div>
                        <Skeleton className="h-px w-full" />
                        <div className="flex items-center space-x-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[200px]" />
                                <Skeleton className="h-4 w-[250px]" />
                            </div>
                        </div>
                        <Skeleton className="h-px w-full" />
                        <div className="flex items-center space-x-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-10 flex-grow" />
                            <Skeleton className="h-10 w-10" />
                        </div>
                    </div>
                ) : (
                    <>
                        <DrawerHeader>
                            {isCommentEmpty ? (
                                <>
                                    <DrawerTitle>No comment yet</DrawerTitle>
                                    <DrawerDescription>Make a first comment?</DrawerDescription>
                                </>
                            ) : (
                                <DrawerTitle>Comment</DrawerTitle>
                            )}
                        </DrawerHeader>
                        {comments.map((comment) => (
                            <React.Fragment key={comment.id}>
                                <div className='flex mx-4 items-center justify-between'>
                                    <div className='w-full h-full flex items-center'>
                                        <Avatar className='w-10 h-10'>
                                            <AvatarImage src={comment.user.image ?? 'https://github.com/shadcn.png'} />
                                        </Avatar>
                                        <div className='ml-3'>
                                            <span className='font-semibold text-md'>{comment.user.name}</span>
                                            <p>{comment.content}</p>
                                        </div>
                                    </div>
                                    {comment.userId === session.user.id && (
                                        <div>
                                            <Popover>
                                                <PopoverTrigger><EllipsisVertical /></PopoverTrigger>
                                                <PopoverContent className="flex flex-col max-w-sm">
                                                    <Button variant={'ghost'} onClick={() => handleDelete(comment.id)}>Delete</Button>
                                                    <Button variant={'ghost'}>Edit</Button>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    )}
                                </div>
                                <Separator className='my-3' />
                            </React.Fragment>
                        ))}
                        <DrawerFooter>
                            <form onSubmit={handleSubmit} className='flex items-center'>
                                <Avatar>
                                    <AvatarImage src={session?.user?.image ?? 'https://github.com/shadcn.png'} />
                                </Avatar>
                                <Input
                                    disabled={isLoading}
                                    type='text'
                                    placeholder='Comment...'
                                    className='mx-3 flex-grow'
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    aria-label="Your comment"
                                />
                                <Button disabled={isLoading} type='submit'>
                                    <FaArrowRight />
                                </Button>
                            </form>
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    )
}

export default CommentDrawer