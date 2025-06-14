"use client";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { GiMusicalNotes } from "react-icons/gi";
import {
  VscAccount,
  VscChromeMaximize,
  VscFolder,
  VscSettingsGear,
  VscVersions,
} from "react-icons/vsc";
import { motion } from "framer-motion";

const Header = () => {
  const menu = [
    {
      name: "Home",
      url: "/",
      icon: <VscChromeMaximize />,
    },
    {
      name: "Songs",
      url: "/songs",
      icon: <GiMusicalNotes />,
    },
    {
      name: "Lists",
      url: "/lists",
      icon: <VscVersions />,
    },
    {
      name: "Local",
      url: "/local",
      icon: <VscFolder />,
    },
    {
      name: "User",
      url: "/user",
      icon: <VscAccount />,
    },
  ];
  const router = useRouter();
  const location = usePathname();
  // console.log(location);
  return (
    <div className="flex items-center flex-col">
      <div className="w-[35px] flex items-end justify-end">
        <VscSettingsGear />
      </div>
      <div className="mt-10 flex items-center flex-col gap-20 ">
        {menu.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              router.push(item.url);
            }}
            className={`${
              location === item.url ? "text-white" : "text-gray-300"
            } flex items-center gap-1 cursor-pointer `}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: location === item.url ? 1 : 0.3 }}
              transition={{ duration: 0.5 }}
              className="text-white"
              //   className={`${
              //     location === item.url ? "text-white" : "invisible"
              //   } `}
            >
              {item.icon}
            </motion.div>
            <div className="rotate-90">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Header;
