import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";

import { LoadingScreen } from "@/components/LoadingScreen";
import { CartProvider } from "@/contexts/CartContext";
import { CartDrawer } from "@/components/CartDrawer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AF Gear — Premium Teamwear",
  description: "Premium teamwear for clubs, schools, and squads. Made to last, made to be affordable.",
};

import { ClerkProvider } from '@clerk/nextjs'

// Check if Clerk key exists to prevent crash
const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground font-sans">
        <ThemeProvider>
          <CartProvider>
            <LoadingScreen />
            <CartDrawer />
            <div className="relative flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <div id="portal-root" />
            </div>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

// Only wrap with ClerkProvider if key is present
if (clerkKey) {
  const OriginalRootLayout = RootLayout;
  // @ts-ignore
  RootLayout = function ({ children }: any) {
    return (
      <ClerkProvider publishableKey={clerkKey}>
        <OriginalRootLayout>
          {children}
        </OriginalRootLayout>
      </ClerkProvider>
    );
  }
}
