import { create } from "zustand";
interface StoreState {
  hasStartedPlaying: boolean;
  isPlaying: boolean;
  togglePlay: () => void;
  audioReference: React.RefObject<HTMLAudioElement> | null;
  setaudioReference: (e: React.RefObject<HTMLAudioElement>) => void;
  handleSeekBar: (e: React.MouseEvent<HTMLDivElement>) => void;
  startPlaying: (link: string) => void;
  isMediaMinimised: boolean;
  mediaMinimiseToggle: () => void;
  mediaStarted: boolean;
  mediaStartedToggle: () => void;
  mediaStopToggle: () => void;
  currentSongId: string | null;
  setSongId: (id: string) => void;
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
  startPlaying: (link: string) => {
    const audio = get().audioReference?.current;
    if (audio) {
      audio.src = link;
      audio.play();
      set({ isPlaying: true, hasStartedPlaying: true });
    }
  },
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
