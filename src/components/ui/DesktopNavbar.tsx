import React from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { Bell, Home, User, PhoneCall } from 'lucide-react'
import { Button } from '../ui/button'
import { SignInButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'

async function DesktopNavbar() {
    const user = await currentUser()
    return (
        <div className="hidden md:flex items-center space-x-4">

            <Button variant="ghost" className="flex items-center gap-2">
                <Link href="/">
                    <Home className="w-4 h-4" />
                    <span className="hidden lg:inline">Home</span>
                </Link>
            </Button>

            <Button variant="ghost" className="flex items-center gap-2">
                <Link href="/voicechat">
                    <PhoneCall className="w-4 h-4" />
                    <span className="hidden lg:inline">Voice Chat</span>
                </Link>
            </Button>

            <Button variant="ghost" className="flex items-center gap-2">
                <Link href="/announcements">
                    <Bell className="w-4 h-4" />
                    <span className="hidden lg:inline">Announcements</span>
                </Link>
            </Button>

            {user ? (
                <>
                    <UserButton />
                </>
            ) : (
                <SignInButton mode="modal">
                    <Button variant="outline">Sign In</Button>
                </SignInButton>
            )}
        </div>
    )
}

export default DesktopNavbar
