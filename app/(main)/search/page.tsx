"use client";
import { SongData } from "@/components/Player";
import { useStore } from "@/store";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Page = () => {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState<SongData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const {
    mediaStartedToggle,
    setSongId,
    setRecentSongs,
    setRecentSongsPlayed,
  } = useStore();

  const fetchSongs = async (reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const limit = 20;
      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_ENV === "development"
            ? "http://localhost:3000/"
            : process.env.NEXT_PUBLIC_API
        }api/song?q=${query}&page=${page}&limit=${limit}`
      );
      const newSongs = response?.data?.data?.results || [];

      setSongs((prev) => (reset ? newSongs : [...prev, ...newSongs]));
      setRecentSongs(newSongs);

      // setTimeout(() => {
      //   bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      // }, 100);
    } catch (error) {
      console.error("Error fetching songs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search trigger
  useEffect(() => {
    if (!query) return;
    const timer = setTimeout(() => {
      setPage(0);
      fetchSongs(true); // reset = true on new query
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch more when page changes (but not for page 0, handled above)
  useEffect(() => {
    if (page === 0 || !query) return;
    fetchSongs();
  }, [page]);

  return (
    <div className="w-full mb-20">
      <div className="w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a name"
          className="w-full px-4 py-2 border-b outline-none rounded-xl"
        />
      </div>

      <div className="my-2 flex items-center justify-between text-sm">
        <div>{query.length > 0 && `Results for ${query}`}</div>
        <div>{songs.length > 0 && `(${songs.length})`}</div>
      </div>

      {loading && songs.length === 0 ? (
        <div className="flex items-center justify-center min-h-[70vh] w-full">
          <AiOutlineLoading3Quarters className="animate-spin" />
        </div>
      ) : songs.length > 0 && query ? (
        <div className="space-y-2">
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
                }}
              >
                <img src={image} alt="song" className="w-14 h-14 rounded-lg" />
                <div className="w-full">
                  <h2 className="text-[11px] ">{song.name}</h2>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-gray-300 ">{artistName}</p>
                    <div className="text-[10px] text-gray-300 ">
                      {minutes}:{seconds.toString().padStart(2, "0")}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Load More Button */}
          {!loading && (
            <p
              className="text-center mb-10 font-100 bg-[#224f59] p-1 rounded cursor-pointer hover:bg-teal-900 hover:scale-90 transition-all duration-300 ease-in-out"
              onClick={() => setPage((prev) => prev + 1)}
            >
              See More
            </p>
          )}

          {/* ✅ Scroll to this on fetch */}
          <div ref={bottomRef} />
        </div>
      ) : (
        query.length > 0 &&
        !loading &&
        songs.length === 0 && (
          <div className="flex items-center justify-center min-h-[70vh] w-full">
            No results found
          </div>
        )
      )}
    </div>
  );
};

export default Page;
