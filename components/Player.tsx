"use client";
import { useStore } from "@/store";
import axios from "axios";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { GoHeart } from "react-icons/go";
import {
  IoPauseSharp,
  IoPlaySharp,
  IoReturnUpBackOutline,
} from "react-icons/io5";
import { LiaShareSolid } from "react-icons/lia";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";

export interface SongData {
  id: string;
  name: string;
  album: {
    id: string;
    name: string;
    url: string;
  };
  artists: {
    primary: Artist[];
    featured: Artist[];
    all: Artist[];
  };
  copyright: string;
  downloadUrl: {
    quality: string;
    url: string;
  }[];
  duration: number;
  explicitContent: boolean;
  hasLyrics: boolean;
  lyricsId: string | null;
  image: {
    quality: string;
    url: string;
  }[];
  label: string;
  language: string;
  playCount: number;
  releaseDate: string;
  type: string;
  url: string;
  year: string;
}

interface Artist {
  id: string;
  name: string;
  role?: string;
  image?: string;
  type?: string;
}

const Player = ({ songId }: { songId: string }) => {
  const {
    handleSeekBar,
    startPlaying,
    isPlaying,
    togglePlay,
    setaudioReference,
    hasStartedPlaying,
    isMediaMinimised,
    mediaMinimiseToggle,
  } = useStore();

  const [currentSong, setCurrentSong] = useState<SongData | null>(null);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const fetchSongById = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_ENV == "development"
            ? "http://localhost:3000/"
            : process.env.NEXT_PUBLIC_API
        }api/song/${songId}`
      );
      setCurrentSong(response?.data?.data[0]);
    } catch (error) {
      console.error("Error fetching song:", error);
    } finally {
      setLoading(false);
    }
  };

  const location = usePathname();

  const shareLink = () => {
    const text = process.env.NEXT_PUBLIC_API + location;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Copied to clipboard! 🎉");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  useEffect(() => {
    fetchSongById();
  }, [songId]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const percent = (audio.currentTime / audio.duration) * 100;
    setProgress(percent);
  };

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.downloadUrl[4]?.url || "";
      audioRef.current.load(); // optional but ensures fresh load
    }
    if (audioRef.current) {
      setaudioReference(audioRef as React.RefObject<HTMLAudioElement>);
    }
    togglePlay();
  }, [currentSong]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] w-full">
        <AiOutlineLoading3Quarters className="animate-spin" />
      </div>
    );
  }

  return (
    <div
      className={` ${
        isMediaMinimised
          ? "h-[10vh]  overflow-hidden"
          : "h-screen min-h-[110vh] overflow-y-scroll p-6 "
      } flex items-center justify-start flex-col  absolute bg-red-700 top-0 w-[100%]   border border-red-500 rounded`}
    >
      <div
        className={` ${
          isMediaMinimised ? "hidden" : ""
        } w-full   flex items-center justify-between`}
      >
        <div
          className=" cursor-pointer hover:text-amber-300"
          onClick={() => {
            mediaMinimiseToggle();
          }}
        >
          <IoReturnUpBackOutline className="size-5" />
        </div>
        <div className="flex items-center gap-2">
          <GoHeart className="cursor-pointer hover:scale-90 transition-all duration-300 size-5" />
          <LiaShareSolid
            className="cursor-pointer hover:scale-90 transition-all duration-300 size-5"
            onClick={() => {
              shareLink();
            }}
          />
        </div>
      </div>
      <div className={`${isMediaMinimised ? "hidden" : ""} w-full my-2`}>
        <h1
          className={` ${isMediaMinimised ? "hidden" : ""} text-2xl font-bold`}
        >
          Now Playing
        </h1>
      </div>

      {/* main  */}
      <div
        className={` ${
          isMediaMinimised
            ? "hidden"
            : "flex tems-center justify-center flex-col w-full"
        } `}
      >
        {/* Album Art */}
        <div className="w-full  flex items-center justify-center">
          <img
            src={currentSong?.image[2]?.url}
            alt="cover"
            className={`  rounded brightness-75 object-cover size-[320px] `}
          />
        </div>

        {/* Song Info */}
        <div className="flex items-center justify-center flex-col mt-10">
          <div className="font-bold text-md text-center my-1">
            {currentSong?.name}
          </div>
          <div className="text-sm text-gray-300">
            {currentSong?.artists.primary[0].name}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 mb-5 flex items-center justify-between w-full gap-4">
          <div
            className={`bg-red-500 px-10 py-5 w-[70%] ${
              isPlaying ? "rounded-4xl" : "rounded-md"
            } flex items-center justify-center transition-all duration-300 ease-in cursor-pointer`}
            onClick={() => {
              if (!hasStartedPlaying) {
                startPlaying(currentSong?.downloadUrl[4]?.url || "");
              } else {
                togglePlay();
              }
            }}
          >
            {isPlaying ? <IoPauseSharp /> : <IoPlaySharp />}
          </div>

          <div
            className={` bg-red-500 p-5 w-[30%] rounded-full flex items-center justify-center cursor-pointer `}
          >
            <MdSkipNext />
          </div>
        </div>
        {/* Audio Player & Back/Next Buttons */}
        <div className="flex items-center justify-between w-full gap-4">
          <div className="bg-red-500 p-5 w-[30%] rounded-full flex items-center justify-center cursor-pointer">
            <MdSkipPrevious />
          </div>

          <div className="w-[70%]">
            <div
              className="relative w-full h-2 bg-red-500  rounded-full cursor-pointer"
              onClick={handleSeekBar}
            >
              <div
                className="absolute top-0 left-0 h-2  bg-gray-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* phone main  */}
      <div
        className={` ${
          isMediaMinimised ? "" : "hidden"
        } flex items-center justify-between gap-4 w-full p-2 cursor-pointer`}
      >
        <div
          onClick={() => {
            if (isMediaMinimised) {
              mediaMinimiseToggle();
            }
          }}
        >
          <img
            src={currentSong?.image[2]?.url}
            alt="cover"
            className={` ${
              isMediaMinimised ? "size-[50px]" : " size-[320px]"
            } rounded brightness-75 object-cover `}
          />
        </div>

        {/* Song Info */}
        <div
          onClick={() => {
            if (isMediaMinimised) {
              mediaMinimiseToggle();
            }
          }}
          className="flex items-center justify-center flex-col "
        >
          <div className="font-bold text-[10px] text-center my-1">
            {currentSong?.name}
          </div>
          <div className="text-[10px] text-gray-300">
            {currentSong?.artists.primary[0].name}
          </div>
        </div>

        {/* play pause  */}
        <div
          className={`bg-red-500 p-2 ${
            isPlaying ? "rounded-4xl" : "rounded-md"
          } flex items-center justify-center transition-all duration-300 ease-in cursor-pointer`}
          onClick={() => {
            if (!hasStartedPlaying) {
              startPlaying(currentSong?.downloadUrl[4]?.url || "");
            } else {
              togglePlay();
            }
          }}
        >
          {isPlaying ? <IoPauseSharp /> : <IoPlaySharp />}
        </div>
      </div>

      <audio
        crossOrigin="anonymous"
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        hidden
      />
    </div>
  );
};

export default Player;
