// store/videoStore.js
import { create } from "zustand";

const useVideoStore = create((set) => ({
  videoFolders: [],
  allVideos:[],
  pivateVideos: [],
  setVideoFolders: (folders) => set({ videoFolders: folders }),
  setAllVideos: (videos) => set({ allVideos: videos }),
  setPrivateVideos: (pVideos) => set({ privateVideos: pVideos }),
  removeVideosFromFolder: (folderPath, videoIds) =>
    set((state) => ({
      videoFolders: state.videoFolders.map((folder) =>
        folder.path === folderPath
          ? {
              ...folder,
              videos: folder.videos.filter((v) => !videoIds.has(v.id)),
              count: folder.videos.filter((v) => !videoIds.has(v.id)).length,
            }
          : folder
      ),
    })),
}));

export default useVideoStore;