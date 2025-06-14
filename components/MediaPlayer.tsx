"use client";
import { useStore } from "@/store";
import React from "react";
import Player from "./Player";

const MediaPlayer = () => {
  const { mediaStarted, currentSongId } = useStore();
  return (
    <div className="absolute bottom-0 top-0 w-[100%]">
      {mediaStarted && currentSongId && <Player songId={currentSongId} />}
    </div>
  );
};

export default MediaPlayer;
