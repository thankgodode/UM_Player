// store/videoStore.js
import { create } from "zustand";

const useVideoStore = create((set) => ({
  videoFolders: [],
  setVideoFolders: (folders) => set({ videoFolders: folders }),
}));

export default useVideoStore;