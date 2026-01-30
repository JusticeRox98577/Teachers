import type { Metadata } from "next";
import { Bebas_Neue, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const displayFont = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
});

const bodyFont = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ISD Teachers | Student Reviews",
  description:
    "Anonymous and signed-in student reviews for Skyline, Issaquah, and Liberty.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable} antialiased`}>
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT ? (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        ) : null}
        {children}
      </body>
    </html>
  );
}
