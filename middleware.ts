import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

const protectedRoutes = ['/profile']

export async function middleware(req:NextRequest) {
    const session = await auth()
    const isLoggedIn = !!session?.user
    const { pathname } = req.nextUrl

    if (!isLoggedIn && protectedRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/signin', req.url))
    }

    if (isLoggedIn && pathname.startsWith('/signin')) {
        return NextResponse.redirect(new URL('/', req.url))
    }
    
}