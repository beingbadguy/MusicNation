"use client";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { GoSearch } from "react-icons/go";

const MiniHeader = () => {
  const MenuMap: Record<string, string> = {
    "/": "Home",
    "/songs": "Songs",
    "/lists": "Lists",
    "/local": "Recently Played",
    "/user": "User",
  };
  const location = usePathname();
  // console.log(MenuMap[location]);
  const router = useRouter();
  return (
    <div className="w-full flex items-center justify-end gap-2 ">
      <div className=" text-2xl font-bold tracking-wider">
        {MenuMap[location]}
      </div>
      <div>
        <GoSearch
          className="text-2xl mt-1 cursor-pointer"
          onClick={() => router.push("/search")}
        />
      </div>
    </div>
  );
};

export default MiniHeader;
