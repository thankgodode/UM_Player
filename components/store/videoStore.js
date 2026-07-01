// store/videoStore.js
import { create } from "zustand";

const useVideoStore = create((set) => ({
  videoFolders: [],
  allVideos: [],
  privateVideos: [], // 👈 fixed typo from pivateVideos

  setVideoFolders: (folders) => set({ videoFolders: folders }),
  setAllVideos: (videos) => set({ allVideos: videos }),
  setPrivateVideos: (videos) => set({ privateVideos: videos }),

  removeVideosFromStore: (videoIds) =>
    set((state) => {
      const idSet = new Set(videoIds);
      return {
        videoFolders: state.videoFolders
          .map((folder) => {
            const remaining = folder.videos.filter((v) => !idSet.has(v.id));
            return { ...folder, videos: remaining, count: remaining.length };
          })
          .filter((folder) => folder.count > 0),
        allVideos: state.allVideos.filter((v) => !idSet.has(v.id)), // 👈 remove from allVideos too
      };
    }),

  removeFolder: (folder) => set((state) => {
    return {
      videoFolders: state.videoFolders.filter((f) => {
        return f.path !== folder[0]
      })
    }
  }),

  addVideosToStore: (videos) =>
    set((state) => {
      const idSet = new Set(videos.map((v) => v.id));

      const folderMap = videos.reduce((acc, video) => {
        const sourceUri = video.originalUri ?? video.uri ?? video.path;
        if (!sourceUri) return acc;

        const folderPath = sourceUri.substring(0, sourceUri.lastIndexOf("/"));
        if (!acc[folderPath]) acc[folderPath] = [];
        acc[folderPath].push({ ...video, uri: sourceUri });
        return acc;
      }, {});

      // Restored videos mapped back to original asset shape
      const restoredVideos = videos.map((v) => ({
        ...v,
        uri: v.originalUri ?? v.uri,
      }));

      return {
        // 👇 restore to videoFolders
        videoFolders: state.videoFolders.map((folder) => {
          const incoming = folderMap[folder.path];
          if (!incoming) return folder;
          return {
            ...folder,
            videos: [...folder.videos, ...incoming],
            count: folder.videos.length + incoming.length,
          };
        }),
        // 👇 restore to allVideos
        allVideos: [...state.allVideos, ...restoredVideos],
        // 👇 remove from privateVideos
        privateVideos: state.privateVideos.filter((v) => !idSet.has(v.id)),
      };
    }),
}));

export default useVideoStore