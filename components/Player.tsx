"use client";
import { useStore } from "@/store";
import axios from "axios";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { GoHeart, GoHeartFill } from "react-icons/go";
import {
  IoPauseSharp,
  IoPlaySharp,
  IoReturnUpBackOutline,
} from "react-icons/io5";
import { LiaDownloadSolid, LiaShareSolid } from "react-icons/lia";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import { isMobile } from "react-device-detect";

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
    isPlaying,
    togglePlay,
    setaudioReference,
    hasStartedPlaying,
    isMediaMinimised,
    mediaMinimiseToggle,
    recentSongs,
    setFavouriteSongs,
    favouriteSongs,
    setRecentSongsPlayed,
  } = useStore();

  const [currentSong, setCurrentSong] = useState<SongData | null>(null);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const nextSongHandle = () => {
    if (!recentSongs) return null;
    setCurrentSong((prev) => {
      if (!prev) return null;
      const currentIndex = recentSongs.findIndex((song) => song.id === prev.id);
      // console.log(currentIndex);
      const nextIndex = currentIndex + 1;
      if (nextIndex >= recentSongs.length) return recentSongs[0];
      else return recentSongs[nextIndex];
    });
  };

  const prevSongHandle = () => {
    if (!recentSongs) return;

    setCurrentSong((prev) => {
      if (!prev) return null;

      const currentIndex = recentSongs.findIndex((song) => song.id === prev.id);
      const prevIndex =
        (currentIndex - 1 + recentSongs.length) % recentSongs.length;

      return recentSongs[prevIndex];
    });
  };

  const isAlreadyFav = () => {
    if (!favouriteSongs) return false;
    return favouriteSongs.some((song) => song.id === currentSong?.id);
  };
  // console.log(isAlreadyFav());

  const notify = () =>
    toast("Link Copied!", {
      duration: 1000,
      position: "top-center",

      // Styling
      style: {
        border: "1px solid #23A1BE",
        padding: "4px",
        backgroundColor: "#0A2E36",
        color: "#23A1BE",
      },
      className: "",

      // Custom Icon
      icon: "🔥",

      // Change colors of success/error/loading icon
      iconTheme: {
        primary: "#23A1BE",
        secondary: "#23A1BE",
      },

      // Aria
      ariaProps: {
        role: "status",
        "aria-live": "polite",
      },

      // Additional Configuration
      removeDelay: 1000,
    });

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

  const downloadAudio = async () => {
    if (!currentSong) return;
    const response = await fetch(currentSong.downloadUrl[4]?.url);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentSong.name}.mp3`; // customize filename
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isTyping =
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA");

      if (e.code === "Space" && !isTyping) {
        e.preventDefault(); // prevent page scroll
        togglePlay();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [hasStartedPlaying, currentSong, togglePlay]);

  useEffect(() => {
    if (currentSong) {
      setRecentSongsPlayed(currentSong);
    }
  }, [currentSong]);

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

  useEffect(() => {
    window.scrollTo(0, 0);
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
          ? "h-[10vh]  overflow-hidden border  border-gray-600 "
          : "h-[100dvh] min-h-[100dvh] max-h-[100dvh] overflow-y-scroll p-6 "
      } flex items-center justify-start flex-col  absolute bg-[#0A2E36] top-0 w-[100%] rounded`}
    >
      {" "}
      <Toaster />
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
          {isAlreadyFav() ? (
            <GoHeartFill className="text-red-500 size-5" />
          ) : (
            <GoHeart
              className="cursor-pointer hover:scale-90 transition-all duration-300 size-5"
              onClick={() => {
                if (!currentSong) return;
                setFavouriteSongs(currentSong);
              }}
            />
          )}

          <LiaDownloadSolid
            onClick={() => {
              if (isMobile) {
                if (!currentSong) return;
                window.open(currentSong.downloadUrl[4]?.url, "_blank");
              } else {
                downloadAudio();
              }
            }}
            className="cursor-pointer hover:scale-90 transition-all duration-300 size-5"
          />
          <LiaShareSolid
            className="cursor-pointer hover:scale-90 transition-all duration-300 size-5"
            onClick={() => {
              notify();
              shareLink();
            }}
          />
        </div>
      </div>
      <div className={`${isMediaMinimised ? "hidden" : ""} w-full my-2`}>
        <h1 className={` ${isMediaMinimised ? "hidden" : ""} font-bold`}>
          Now Playing
        </h1>
      </div>
      {/* main  */}
      <div
        className={` ${
          isMediaMinimised
            ? "hidden"
            : "flex tems-center justify-center flex-col w-full mt-2"
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
            className={`bg-[#135867] px-10 py-5 w-[70%] ${
              isPlaying ? "rounded-4xl" : "rounded-md"
            } flex items-center justify-center transition-all duration-300 ease-in cursor-pointer`}
            onClick={() => {
              togglePlay();
            }}
          >
            {isPlaying ? <IoPauseSharp /> : <IoPlaySharp />}
          </div>

          <div
            className={` bg-[#135867] p-5 w-[30%] rounded-full flex items-center justify-center cursor-pointer `}
            onClick={nextSongHandle}
          >
            <MdSkipNext />
          </div>
        </div>
        {/* Audio Player & Back/Next Buttons */}
        <div className="flex items-center justify-between w-full gap-4">
          <div
            className="bg-[#135867] p-5 w-[30%] rounded-full flex items-center justify-center cursor-pointer"
            onClick={prevSongHandle}
          >
            <MdSkipPrevious />
          </div>

          <div className="w-[70%]">
            <div
              className="relative w-full h-2 bg-[#135867]  rounded-full cursor-pointer"
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
      {/* phone minimized player */}
      <div
        onClick={() => {
          if (isMediaMinimised) {
            mediaMinimiseToggle();
          }
        }}
        className={`${
          isMediaMinimised ? "" : "hidden"
        } relative flex items-center w-full p-4 cursor-pointer overflow-hidden`}
      >
        {/* Progress bar behind everything */}
        <div
          className="absolute top-0 left-0 h-full bg-[#135867] opacity-50 z-0 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />

        {/* Image */}
        <img
          src={currentSong?.image[2]?.url}
          alt="cover"
          className="size-[50px] rounded object-cover z-10"
        />

        {/* Info */}
        <div className="flex-1 flex flex-col justify-center px-4 z-10 overflow-hidden">
          <div className="font-bold text-[10px] text-white truncate">
            {currentSong?.name}
          </div>
          <div className="text-[10px] text-gray-300 truncate">
            {currentSong?.artists.primary[0].name}
          </div>
        </div>

        {/* Play/Pause Button */}
        <div
          className={`bg-[#135867] p-2 ${
            isPlaying ? "rounded-4xl" : "rounded-md"
          } flex items-center justify-center transition-all duration-300 ease-in cursor-pointer z-10`}
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
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
        onEnded={nextSongHandle}
      />
    </div>
  );
};

export default Player;
