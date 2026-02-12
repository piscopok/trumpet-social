import React from 'react'
import MobileNavbar from './MobileNavbar'
import DesktopNavbar from './DesktopNavbar'
import { currentUser } from "@clerk/nextjs/server";
import { syncUser } from '@/actions/user.action';

async function navbar() {
  const user = await currentUser();
  if(user)
  {
    await syncUser();
  }
  return (
    <nav className="sticky top-0 w-full border-b bg-[#1f5a17] z-50">
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                    <a href="/" className="text-xl font-bold">IDK what to call this lmao</a>
                </div>
                <DesktopNavbar />
                <MobileNavbar />
            </div>
        </div>
    </nav>
  )
}

export default navbar
