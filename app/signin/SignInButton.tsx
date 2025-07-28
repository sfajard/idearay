import { Button } from '@/components/ui/button'
import { signIn } from '@/auth'
import React from 'react'

const SignInButton = () => {
    return (
        <form action={async () => {
            'use server'
            await signIn('google')
        }}>
            <Button variant="outline" className="w-full">
                Login with Google
            </Button>
        </form>
    )
}

export default SignInButton