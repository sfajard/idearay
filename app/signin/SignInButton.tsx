import { Button } from '@/components/ui/button'
import { signIn } from '@/auth'
import React from 'react'

const SignInButton = () => {
    return (
        <form className='w-full' action={async () => {
            'use server'
            await signIn('google')
        }}>
            <Button className="w-full">
                Login with Google
            </Button>
        </form>
    )
}

export default SignInButton