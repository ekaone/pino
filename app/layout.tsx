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
  title: "Pino",
  description: "Pino is a piano app to play music",
  openGraph: {
    title: "Pino",
    description: "Pino is a piano app to play music",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pino Piano App Open Graph Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pino",
    description: "Pino is a piano app to play music",
    images: [
      {
        url: "/og-image.png",
        alt: "Pino Piano App Twitter Card Image",
      },
    ],
    creator: "@twekaone", // Optional: replace with your Twitter handle
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
