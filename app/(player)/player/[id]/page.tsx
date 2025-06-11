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
  console.log(params.id);

  const [currentSong, setCurrentSong] = useState<SongData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = (link: string) => {
    console.log(link);
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.src = link;
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
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
      console.log(response?.data.data[0]);
    } catch (error) {
      console.error("Error fetching song:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongById();
  }, [params.id]);

  console.log(currentSong?.downloadUrl[4]?.url);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] w-full ">
        <AiOutlineLoading3Quarters className="animate-spin" />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center flex-col h-[90vh] max-h-[90vh] relative">
      <div
        className="absolute top-0 left-0 cursor-pointer"
        onClick={() => router.back()}
      >
        <IoReturnUpBackOutline />
      </div>
      <div>
        <img
          src={currentSong?.image[2]?.url}
          alt=""
          className="rounded brightness-75 object-cover size-[300px]"
        />
      </div>
      <div className="flex items-center justify-center flex-col mt-10">
        <div className="font-bold text-lg text-center my-1">
          {currentSong?.name}
        </div>
        <div className="text-sm text-gray-300">
          {currentSong?.artists.primary[0].name}
        </div>
      </div>
      <div className="my-6 flex items-center justify-between w-full gap-4">
        <div
          className={`bg-red-500 px-10 py-3 w-[70%] ${
            isPlaying ? "rounded-4xl" : "rounded-md"
          } flex items-center justify-center transition-all duration-300 ease-in cursor-pointer`}
          onClick={() => {
            if (currentSong && currentSong?.downloadUrl[0]?.url) {
              togglePlay(currentSong?.downloadUrl[0]?.url);
            }
          }}
        >
          {isPlaying ? <IoPauseSharp /> : <IoPlaySharp />}
        </div>
        <div className="bg-red-500 p-3 w-[30%] rounded-full flex items-center justify-center cursor-pointer">
          <MdSkipNext />
        </div>
      </div>
      <div className="my-6 flex items-center justify-between w-full gap-4">
        <div className="bg-red-500 p-3 w-[30%] rounded-full flex items-center justify-center cursor-pointer">
          <MdSkipPrevious />
        </div>
        <div>
          {" "}
          <audio ref={audioRef} controls className="mt-4 " />
        </div>
      </div>
    </div>
  );
};

export default Page;
