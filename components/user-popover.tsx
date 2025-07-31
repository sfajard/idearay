import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Session } from 'next-auth'

interface UserPopOverProps {
    session: Session | null
    handleSignOut: () => void
}

const UserPopOver = ({ session, handleSignOut }: UserPopOverProps) => {
    console.log({ session })
    return (
        <Popover>
            <PopoverTrigger>
                <Avatar>
                    <AvatarImage src={session?.user?.image ?? 'https://github.com/shadcn.png'} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </PopoverTrigger>
            <PopoverContent className='text-left'>
                {session?.user && (
                    <div className="flex flex-col space-y-1 ">
                        <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {session.user?.email}
                        </p>
                    </div>
                )}
                <Button size={'sm'} variant={'link'} onClick={handleSignOut}>Sign Out</Button>
            </PopoverContent>
        </Popover>
    )
}

export default UserPopOver