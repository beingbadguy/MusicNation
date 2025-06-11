"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  IoPauseSharp,
  IoPlaySharp,
  IoReturnUpBackOutline,
} from "react-icons/io5";
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

const Page = () => {
  const params = useParams();
  const router = useRouter();

  const [currentSong, setCurrentSong] = useState<SongData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const fetchSongById = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_ENV == "development"
            ? "http://localhost:3000/"
            : process.env.NEXT_PUBLIC_API
        }api/song/${params.id}`
      );
      setCurrentSong(response?.data?.data[0]);
    } catch (error) {
      console.error("Error fetching song:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongById();
  }, [params.id]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const percent = (audio.currentTime / audio.duration) * 100;
    setProgress(percent);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * (audioRef.current?.duration || 0);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Set the audio src only once when song is ready
  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.downloadUrl[4]?.url || "";
      audioRef.current.load(); // optional but ensures fresh load
    }
  }, [currentSong]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] w-full">
        <AiOutlineLoading3Quarters className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center flex-col h-[90vh] max-h-[90vh] relative">
      <div
        className="absolute -top-5 left-0 cursor-pointer hover:text-amber-300"
        onClick={() => router.back()}
      >
        <IoReturnUpBackOutline />
      </div>

      {/* Album Art */}
      <div>
        <img
          src={currentSong?.image[2]?.url}
          alt="cover"
          className="rounded brightness-75 object-cover size-[360px]"
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
          onClick={togglePlay}
        >
          {isPlaying ? <IoPauseSharp /> : <IoPlaySharp />}
        </div>

        <div className="bg-red-500 p-5 w-[30%] rounded-full flex items-center justify-center cursor-pointer">
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
            onClick={handleSeek}
          >
            <div
              className="absolute top-0 left-0 h-2  bg-gray-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} hidden />
        </div>
      </div>
    </div>
  );
};

export default Page;
