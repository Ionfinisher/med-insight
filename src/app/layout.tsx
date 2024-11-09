import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "MedInsight",
    template: "%s | MedInsight",
  },
  authors: [
    {
      name: "Teddy ASSIH",
      url: "https://www.linkedin.com/in/teddy-assih-b4204b254/",
    },
  ],
  description:
    "An ai powered medecine insight app built with Next.js, Postgresql",
  keywords: "ai, medecine, insight, next.js, postgresql",
  openGraph: {
    title: "MedInsight",
    description:
      "An ai powered medecine insight app built with Next.js, Postgresql",
    url: "https://medinsight.vercel.app",
    siteName: "MedInsight",
    images: [
      {
        url: "/og.png",
        width: 2530,
        height: 1148,
      },
    ],
    locale: "en-US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "MedInsight",
    card: "summary_large_image",
    description:
      "An ai powered medecine insight app built with Next.js, Postgresql",
  },
  icons: {
    shortcut: "/icon.svg",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-900 text-white`}
      >
        {children}
      </body>
    </html>
  );
}
