import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://youtube-transcribe.com"), // Замените на ваш реальный домен
  title: "YouTube Transcribe - Транскрибация видео с YouTube",
  description: "Быстро и легко получайте текстовую транскрипцию любого видео с YouTube. Просто вставьте ссылку и получите текст.",
  keywords: ["YouTube", "transcript", "transcription", "video to text", "транскрибация", "видео в текст"],
  openGraph: {
    title: "YouTube Transcribe - Мгновенная транскрибация видео",
    description: "Сервис для быстрой и точной транскрибации видео с YouTube на разных языках.",
    url: "https://youtube-transcribe.com", // Замените на ваш реальный домен
    type: "website",
    images: [
      {
        url: "/og-image.png", // Создайте и добавьте это изображение в public/
        width: 1200,
        height: 630,
        alt: "YouTube Transcribe",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube Transcribe - Транскрибация видео с YouTube",
    description: "Быстро и легко получайте текстовую транскрипцию любого видео с YouTube. Просто вставьте ссылку и получите текст.",
    images: ["/og-image.png"], // Замените на ваш реальный домен
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning={true}>
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
