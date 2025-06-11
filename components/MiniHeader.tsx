"use client";
import { usePathname } from "next/navigation";
import React from "react";

const MiniHeader = () => {
  const MenuMap: Record<string, string> = {
    "/": "Home",
    "/songs": "Songs",
    "/lists": "Lists",
    "/local": "Local",
    "/user": "User",
  };
  const location = usePathname();
  console.log(MenuMap[location]);
  return (
    <div className="w-full flex items-center justify-end text-2xl font-bold tracking-wider">
      {MenuMap[location]}
    </div>
  );
};

export default MiniHeader;
