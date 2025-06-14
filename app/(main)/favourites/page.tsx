"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/store";
import { IoHeartOutline } from "react-icons/io5";

const Page = () => {
  const {
    mediaStartedToggle,
    setSongId,
    favouriteSongs,
    setLastPlayedSongId,
    setRecentSongsPlayed,
    getFavouriteSongs,
  } = useStore();

  useEffect(() => {
    getFavouriteSongs();
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
        {favouriteSongs?.length > 0 ? (
          <div className="text-lg font-[300] flex items-center gap-1">
            Your favourites! <IoHeartOutline />
          </div>
        ) : (
          <h1 className="text-lg font-[300] mb-4 flex items-center justify-center min-h-[90vh]">
            You have no favourites!
          </h1>
        )}
      </div>
      <div className="space-y-2 my-4">
        {favouriteSongs &&
          favouriteSongs?.map((song) => {
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
