'use client'

import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "./ui/navigation-menu";
import { Button } from "./ui/button";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import UserPopOver from "./user-popover";

export const Navbar = () => {
    const { data: session } = useSession()
    const handleSignOut = async () => {
        signOut()
    }
    
    return (
        <nav className="sticky top-0 z-40 w-full px-4 py-3 bg-primary text-primary-foreground shadow-sm border-b flex justify-between">
            <span className="text-2xl font-bold"><Link href={'/'}>Logo</Link></span>
            <NavigationMenu className="w-full flex justify-between">
                <NavigationMenuList className="w-full">
                    <NavigationMenuItem>
                        {session?.user ? (
                            <UserPopOver handleSignOut={handleSignOut} session={session}/>
                        ) : (
                            <Button className="cursor-pointer"><Link href='/signin'>Log In</Link></Button>
                        )}
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </nav>
    );
};