import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { EllipsisVertical } from "lucide-react";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { deletePost } from "@/lib/actions/post";

interface PostCardProps {
    id: string;
    userId: string;
    username: string;
    avatarUrl: string;
    content: string;
    timestamp: string;
    onSuccess: () => void
}

export function PostCard({ username, avatarUrl, content, timestamp, userId, id, onSuccess }: PostCardProps) {
    const { data: session } = useSession()

    const isOwner = session?.user.id === userId
    const handleDelete = async () => {
        deletePost(id)
        onSuccess()
    }
    return ( 
        <Card className="mb-4">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
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
            <CardContent className="py-2">
                <p>{content}</p>
            </CardContent>
            <CardFooter>
                <p className="text-sm text-gray-400">0 Likes</p>
            </CardFooter>
        </Card>
    );
}