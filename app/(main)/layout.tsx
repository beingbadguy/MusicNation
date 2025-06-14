"use client";
import { Geist_Mono } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import MiniHeader from "@/components/MiniHeader";
import MediaPlayer from "@/components/MediaPlayer";
import { useStore } from "@/store";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { mediaStarted, isMediaMinimised } = useStore();
  return (
    <html lang="en">
      <body
        className={`${geistMono.className} ${geistMono.className} antialiased flex items-center justify-center `}
      >
        <div className="flex items-start w-full sm:w-1/2 md:w-sm lg:w-sm sm:max-w-3xl   justify-center pt-10 bg-red-700  min-h-screen  max-h-screen overflow-hidden px-2 relative">
          {mediaStarted && (
            <div
              className={`${
                isMediaMinimised
                  ? "translate-y-[90%] fixed  bottom-0 w-full sm:w-1/2 md:w-sm lg:w-sm sm:max-w-3xl left-1/2 translate-x-[-50%]"
                  : ""
              } absolute top-0 bottom-0 inset-0 z-[999] transniton-all duration-300 ease-in-out pb-2 `}
            >
              <MediaPlayer />
            </div>
          )}
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
