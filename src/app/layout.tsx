import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "ПрокатМаркет — Аренда товаров",
  description: "Аренда любых товаров прямо сейчас",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.className} antialiased bg-white text-gray-900`}>
        <div className="max-w-4xl mx-auto min-h-screen flex flex-col border-x border-gray-100 shadow-sm bg-white">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <footer className="py-8 px-5 border-t border-gray-100 text-center text-sm text-gray-400">
            <p>© 2024 ПрокатМаркет. Все права защищены.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
