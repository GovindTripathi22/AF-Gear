"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { User } from "lucide-react";

export function AuthButtons() {
    // Safety check: Don't render Clerk components if the key is missing
    const isAuthEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

    if (!isAuthEnabled) {
        return (
            <button className="text-white hover:text-primary transition-colors p-2 hidden sm:block" title="Auth not configured">
                <User className="w-5 h-5" />
            </button>
        );
    }

    return (
        <div className="flex items-center gap-4">
            <SignedOut>
                <SignInButton mode="modal">
                    <button className="text-xs font-bold uppercase tracking-widest text-white hover:text-primary transition-colors">
                        Sign In
                    </button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <UserButton
                    appearance={{
                        elements: {
                            avatarBox: "w-8 h-8 ring-2 ring-white/10 hover:ring-primary transition-all"
                        }
                    }}
                />
            </SignedIn>
        </div>
    );
}
