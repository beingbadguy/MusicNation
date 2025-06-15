"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/store";

const Page = () => {
  const {
    getRecentSongsPlayed,
    recentSongsPlayed,
    mediaStartedToggle,
    setSongId,
    setLastPlayedSongId,
    setRecentSongsPlayed,
  } = useStore();

  useEffect(() => {
    getRecentSongsPlayed();
    window.scrollTo(0, 0);
  }, []);
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
      }}
      className="mb-30"
    >
      <div className="">
        {recentSongsPlayed?.length > 0 ? (
          ""
        ) : (
          <h1 className="text-lg font-[300] mb-4 flex items-center justify-center min-h-[90vh]">
            No recent played
          </h1>
        )}
      </div>
      <div className="space-y-2 my-4">
        {recentSongsPlayed &&
          recentSongsPlayed?.map((song) => {
            const artistName = song?.artists?.primary[0]?.name;
            const image = song?.image[0]?.url;
            const duration = song?.duration;
            const minutes = Math.floor(duration / 60);
            const seconds = duration % 60;

            return (
              <div
                key={song.id}
                className="mb-2 flex gap-2 items-center cursor-pointer hover:bg-[#135867] rounded p-1"
                onClick={() => {
                  mediaStartedToggle();
                  setSongId(song.id);
                  // console.log(song?.artists?.primary[0]?.id);
                  setRecentSongsPlayed(song);
                  setLastPlayedSongId(song?.artists?.primary[1]?.id);
                }}
              >
                <img src={image} alt="song" className="w-14 h-14 rounded-lg" />
                <div className="w-full">
                  <h2 className="text-[11px] ">{song.name}</h2>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-gray-300 ">{artistName}</p>
                    <div className="text-[10px] text-gray-300 ">
                      {minutes}:{seconds}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </motion.div>
  );
};

export default Page;
