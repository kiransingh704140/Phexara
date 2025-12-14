import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
   title: {
    default: 'Phexara – AI Image Prompt Gallery',
    template: '%s | Phexara',
  },
  description:
    'Discover high-quality AI-generated images with detailed prompts. Copy AI prompts for Google Gemini, Midjourney, Stable Diffusion, DALL·E and more.',
  icons: {
    icon: '/logo.png',
  },
  verification: {
    google: 'RV0ysbgCq4CuFl1dQf28PrKGoObGrQ7v5yYvQo0aFsg', 
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 text-black dark:bg-black dark:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
