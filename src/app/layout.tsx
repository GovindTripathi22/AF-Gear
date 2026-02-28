import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { Navbar } from "@/components/ui/Navbar";

import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { CartProvider } from "@/contexts/CartContext";
import { CartDrawer } from "@/components/products/CartDrawer";
<<<<<<< HEAD
=======
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
>>>>>>> 3821d51ef6907b25405ee28a29115574ea73e822

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

<<<<<<< HEAD
import { ClerkProvider } from '@clerk/nextjs'

// Check if Clerk key exists to prevent crash
const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

function BaseLayout({
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

=======
>>>>>>> 3821d51ef6907b25405ee28a29115574ea73e822
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
<<<<<<< HEAD
  if (clerkKey) {
    return (
      <ClerkProvider publishableKey={clerkKey}>
        <BaseLayout>{children}</BaseLayout>
      </ClerkProvider>
    );
  }
  return <BaseLayout>{children}</BaseLayout>;
=======
  return (
    <ClerkProvider>
      <html lang="en" className={`${outfit.variable} ${inter.variable}`} suppressHydrationWarning>
        <body className="antialiased bg-background text-foreground font-sans">
          <ThemeProvider>
            <CartProvider>
              <LoadingScreen />
              <CartDrawer />
              <Toaster theme="dark" position="bottom-center" toastOptions={{
                className: 'bg-black/80 backdrop-blur-md border border-white/10 text-white font-medium',
              }} />
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
    </ClerkProvider>
  );
>>>>>>> 3821d51ef6907b25405ee28a29115574ea73e822
}
