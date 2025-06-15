"use client";
// import { SongData } from "@/components/Player";
import { useStore } from "@/store";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const { getLastPlayedSongId, lastPlayedSongId, setRecentSongs } = useStore();
  const router = useRouter();
  // const [songs, setSongs] = React.useState<SongData[]>([]);
  // console.log(lastPlayedSongId);
  const fetchSuggestedSongs = async () => {
    try {
      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_ENV == "development"
            ? "http://localhost:3000/"
            : process.env.NEXT_PUBLIC_API
        }api/suggestions/${lastPlayedSongId}`
      );
      // console.log(response.data);
      setRecentSongs(response?.data?.data?.results || []);
      // setSongs(response?.data?.data?.results || []);
      // console.log(response?.data?.data?.results || []);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };
  useEffect(() => {
    getLastPlayedSongId();
    fetchSuggestedSongs();
  }, [lastPlayedSongId]);
  useEffect(() => {
    router.push("/songs");
  });
  return null;
};

export default Page;
