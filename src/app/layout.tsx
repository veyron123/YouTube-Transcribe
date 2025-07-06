import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
const inter = Inter({ subsets: ["latin", "cyrillic"] });

// Пока оставляем базовые метаданные, позже сделаем их динамическими
export const metadata: Metadata = {
  title: "YouTube Transcribe",
  description: "Transcribe YouTube videos instantly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-GCL8Z1TSPW"></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GCL8Z1TSPW');
          `}
        </script>
      </head>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}