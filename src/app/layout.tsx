import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/layout/BottomNav";
import Header from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lojinha Studio | Seus Conteúdos Exclusivos",
  description: "Plataforma premium para você assistir seus conteúdos digitais com a melhor qualidade e experiência.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Lojinha Studio",
  },
  openGraph: {
    title: "Lojinha Studio",
    description: "Plataforma premium de conteúdos digitais",
    url: "https://miniapp.com",
    siteName: "Lojinha Studio",
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1 pb-16 md:pb-0 pt-0 md:pt-16">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
