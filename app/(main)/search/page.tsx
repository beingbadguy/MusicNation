"use client";
import { SongData } from "@/components/Player";
import { useStore } from "@/store";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Page = () => {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState<SongData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { mediaStartedToggle, setSongId } = useStore();
  const searchSong = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_ENV == "development"
            ? "http://localhost:3000/"
            : process.env.NEXT_PUBLIC_API
        }api/song?q=${query}`
      );
      // console.log(response.data.data);
      setSongs(response?.data?.data?.results || []);
    } catch (error) {
      console.error("Error fetching songs:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      searchSong();
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);
  return (
    <div className="w-full">
      <div className="w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a name"
          className=" w-full px-4 py-2 border-b outline-none rounded-xl"
        />
      </div>

      <div className="my-2 flex items-center justify-between text-sm">
        <div>{query.length > 0 && `Results for ${query}`}</div>
        <div>{songs.length > 0 && `(${songs.length})`}</div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center min-h-[70vh] w-full ">
          <AiOutlineLoading3Quarters className="animate-spin" />
        </div>
      ) : songs.length > 0 && query ? (
        <div className="space-y-2">
          {songs?.map((song) => {
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
      ) : (
        query.length > 0 &&
        !loading &&
        songs.length == 0 && (
          <div className="flex items-center justify-center min-h-[70vh] w-full ">
            No results found
          </div>
        )
      )}
    </div>
  );
};

export default Page;
