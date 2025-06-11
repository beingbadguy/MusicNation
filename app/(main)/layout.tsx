import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import MiniHeader from "@/components/MiniHeader";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Musify",
  description: "Music App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistMono.className} ${geistMono.className} antialiased flex items-center justify-center  `}
      >
        <div className="flex items-start w-full sm:w-1/2 md:w-1/2 lg:w-xl sm:max-w-3xl  justify-center pt-10 bg-red-700  min-h-screen  px-2 ">
          <div className="w-[100px]">
            <Header />
          </div>
          <div className="w-full    flex items-start justify-start flex-col">
            <MiniHeader />
            <div className="w-full max-h-screen min-h-[90vh] h-[90vh] overflow-y-scroll pt-2">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
