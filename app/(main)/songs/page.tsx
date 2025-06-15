"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { SongData } from "@/components/Player";
import { useStore } from "@/store";

const Page = () => {
  const [songs, setSongs] = useState<SongData[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const {
    mediaStartedToggle,
    setSongId,
    setRecentSongs,
    setLastPlayedSongId,
    setRecentSongsPlayed,
  } = useStore();

  const [page, setPage] = useState(0);

  const handleScroll = () => {
    if (loading) return;
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.body.offsetHeight;
    if (scrollTop + windowHeight + 100 >= docHeight) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    setPage(0);
  }, []);

  useEffect(() => {
    fetchSongs();
  }, [page]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchSongs = async () => {
    setLoading(true);
    try {
      const limit = 20;
      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_ENV === "development"
            ? "http://localhost:3000/"
            : process.env.NEXT_PUBLIC_API
        }api/song?q=arijit&page=${page}&limit=${limit}`
      );

      const newSongs = response?.data?.data?.results || [];
      setSongs((prevSongs) => [...prevSongs, ...newSongs]);
      setRecentSongs(newSongs);

      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100); // give React time to update DOM
    } catch (error) {
      console.error("Error fetching songs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] w-full ">
        <AiOutlineLoading3Quarters className="animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring" }}
      className="mb-20"
    >
      <div className="space-y-2 my-4">
        {songs.map((song) => {
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
        {/* 🔥 Scroll target */}
        <div ref={bottomRef} />
      </div>

      <p
        className="text-center mb-10 font-100 bg-[#224f59] p-1 rounded"
        onClick={() => {
          setPage(page + 1);
        }}
      >
        See More
      </p>
    </motion.div>
  );
};

export default Page;
