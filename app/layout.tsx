import type { Metadata } from "next";
import { Playfair_Display, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/shared/layout";
import { Footer } from "@/shared/layout";
import { MobileNav } from "@/shared/layout";
import { AuthProvider } from "@/features/auth";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const space = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Filmazia | Movie Tracker",
  description:
    "Track your favorite movies, build your watchlist, Watch Trailers and discover new films with Filmazia.",
  keywords: ["movies", "tracker", "watchlist", "film", "cinema"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${space.variable}`}>
      <body className="font-body bg-cinematic-black text-white min-h-screen">
        <div className="grain-overlay" />
        <AuthProvider>
          <Header />
          <main className="pt-16 pb-20 md:pb-0 md:pt-20 min-h-[calc(100vh-64px)]">
            {children}
          </main>
          <Footer />
          <MobileNav />
        </AuthProvider>
      </body>
    </html>
  );
}
