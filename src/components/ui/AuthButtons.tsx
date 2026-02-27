"use client";

import { User } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";

export function AuthButtons() {
    const { user } = useUser();
    const isAdmin = user?.primaryEmailAddress?.emailAddress === "govindtriapthi3@gmail.com";

    return (
        <div className="hidden sm:flex items-center gap-4">
            <SignedIn>
                <div className="flex items-center gap-3">
                    {isAdmin && (
                        <Link href="/admin" className="text-primary hover:text-white transition-colors text-xs font-bold uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded border border-primary/20">
                            Admin Panel
                        </Link>
                    )}
                    <Link href="/profile" className="text-white hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest">
                        My Profile
                    </Link>
                    <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-8 h-8 rounded-full border border-white/20" } }} />
                </div>
            </SignedIn>
            <SignedOut>
                <SignInButton mode="modal">
                    <button className="text-white flex items-center gap-2 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest">
                        <User className="w-4 h-4" /> Sign In
                    </button>
                </SignInButton>
            </SignedOut>
        </div>
    );
}
