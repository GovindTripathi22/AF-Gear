import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { Navbar } from "@/components/ui/Navbar";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { CartProvider } from "@/contexts/CartContext";
import { CartDrawer } from "@/components/products/CartDrawer";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";

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

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_Y2xlcmstYWZpbi0zOC5jbGVyay5hY2NvdW50cy5kZXYk'}
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#66BB6A",
          colorBackground: "#0A0A0A",
          colorInputBackground: "#141414",
          colorText: "#FFFFFF",
        },
        layout: {
          logoImageUrl: "/assets/af-logo.png",
          socialButtonsVariant: "iconButton",
        },
      }}
    >
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
}
