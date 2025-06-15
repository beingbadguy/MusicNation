import { create } from "zustand";
import { SongData } from "./components/Player";
interface StoreState {
  hasStartedPlaying: boolean;
  isPlaying: boolean;
  togglePlay: () => void;
  audioReference: React.RefObject<HTMLAudioElement> | null;
  setaudioReference: (e: React.RefObject<HTMLAudioElement>) => void;
  handleSeekBar: (e: React.MouseEvent<HTMLDivElement>) => void;
  isMediaMinimised: boolean;
  mediaMinimiseToggle: () => void;
  mediaStarted: boolean;
  mediaStartedToggle: () => void;
  mediaStopToggle: () => void;
  currentSongId: string | null;
  setSongId: (id: string) => void;
  recentSongs: SongData[];
  setRecentSongs: (songs: SongData[]) => void;
  lastPlayedSongId: string | null;
  setLastPlayedSongId: (id: string) => void;
  getLastPlayedSongId: () => void;
  recentSongsPlayed: SongData[];
  setRecentSongsPlayed: (song: SongData) => void;
  getRecentSongsPlayed: () => void;
  favouriteSongs: SongData[];
  setFavouriteSongs: (songs: SongData) => void;
  getFavouriteSongs: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  isPlaying: false,
  mediaStarted: false,
  hasStartedPlaying: false,
  currentSongId: null,
  setSongId: (id) => set({ currentSongId: id }),
  mediaStartedToggle: () => set({ mediaStarted: true }),
  mediaStopToggle: () => set({ mediaStarted: false }),
  isMediaMinimised: false,
  mediaMinimiseToggle: () => set({ isMediaMinimised: !get().isMediaMinimised }),
  lastPlayedSongId: null,
  setLastPlayedSongId: (id) => {
    if (!id) return null;
    localStorage.setItem("lastSongId", id);
    set({ lastPlayedSongId: id });
  },
  getLastPlayedSongId: () => {
    localStorage.getItem("lastSongId"),
      set({ lastPlayedSongId: localStorage.getItem("lastSongId") });
  },
  recentSongs: [],
  setRecentSongs: (songs: SongData[]) => set({ recentSongs: songs }),
  togglePlay: () => {
    const audio = get().audioReference?.current;
    if (audio) {
      if (audio.paused) {
        audio.play();
        set({ isPlaying: true });
      } else {
        audio.pause();
        set({ isPlaying: false });
      }
    }
  },
  recentSongsPlayed: [],
  setRecentSongsPlayed: (song: SongData) => {
    if (!song) return;
    const { getRecentSongsPlayed, recentSongsPlayed } = get();
    getRecentSongsPlayed();
    const alreadyExists = recentSongsPlayed.find((f) => f.id === song.id);
    if (alreadyExists) return;
    set({ recentSongsPlayed: [...get().recentSongsPlayed, song] });
    const updatedRecentSongs = get().recentSongsPlayed;
    localStorage.setItem(
      "recentSongsPlayed",
      JSON.stringify(updatedRecentSongs)
    );
  },
  getRecentSongsPlayed: () => {
    const recentSongsPlayed = localStorage.getItem("recentSongsPlayed");
    if (recentSongsPlayed) {
      set({
        recentSongsPlayed: JSON.parse(recentSongsPlayed),
      });
    }
  },
  favouriteSongs: [],
  setFavouriteSongs: (song: SongData) => {
    if (!song) return;
    const { favouriteSongs } = get();
    get().getFavouriteSongs();
    const alreadyExists = favouriteSongs.find((f) => f.id === song.id);
    if (alreadyExists) return;
    set({ favouriteSongs: [...get().favouriteSongs, song] });
    const updatedFavouriteSongs = get().favouriteSongs;
    localStorage.setItem(
      "favouriteSongs",
      JSON.stringify(updatedFavouriteSongs)
    );
  },
  getFavouriteSongs: () => {
    const favouriteSongs = localStorage.getItem("favouriteSongs");
    if (favouriteSongs) {
      set({
        favouriteSongs: JSON.parse(favouriteSongs),
        recentSongs: JSON.parse(favouriteSongs),
      });
    }
  },

  audioReference: null,
  setaudioReference: (audioReference) => set({ audioReference }),
  handleSeekBar: (e) => {
    const { audioReference } = get();
    if (!audioReference || !audioReference.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * (audioReference.current?.duration || 0);
    if (audioReference.current) {
      audioReference.current.currentTime = newTime;
    }
  },
}));
