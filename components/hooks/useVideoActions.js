// hooks/useVideoActions.js
import { useState } from "react";
import * as RNFS from "react-native-fs";
import { Toast } from "toastify-react-native";
import { hideVideo, unhideVideo } from "../store/hiddenVideos";
import useVideoStore from "../store/videoStore";

export default function useVideoActions({ onSuccess } = {}) {
  const [hiding, setHiding] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const removeVideosFromStore = useVideoStore((s) => s.removeVideosFromStore);
  const removeFolder = useVideoStore((s) => s.removeFolder)
  const addVideosToStore = useVideoStore((s) => s.addVideosToStore);

  async function hideSelectedVideos(selected, clearSelection) {
    setHiding(true); // 👈 show modal
        
        try {
            const videos = Array.from(selected.values());
            await Promise.all(videos.map((video) => hideVideo(video)));

            // removeVideosFromFolder(path, new Set(selected.keys()));
            removeVideosFromStore(Array.from(selected.keys())); // just IDs

            setHiding(false)
            clearSelection(); // clear selection after hiding
        } catch (e) {
            console.log("Failed to hide videos:", e);
        }
  }

  async function unhideSelectedVideos(selected, clearSelection) {
    setHiding(true)
    try {
        const videos = Array.from(selected.values());
        await Promise.all(videos.map((video) => unhideVideo(video.id)));

        addVideosToStore(Array.from(selected.values())); // full video objects
        setHiding(true)
        clearSelection(); // clear selection after hiding

    } catch (e) {
        console.log("Failed to unhide videos:", e);
    }
  }

  async function handleConfirmDelete(selected, clearSelection, type) {
    setDeleting(true);
    try {
      const videos = Array.from(selected.values());

      await Promise.all(
        videos.map(async (video) => {
          const path = video.uri.replace("file://", "");
          await RNFS.unlink(path);
        })
      );

      if (type === "folder") {
        removeFolder(Array.from(selected.keys()))
      } else {
        removeVideosFromStore(Array.from(selected.keys()));
      }

      await Promise.all(
        videos.map((video) => RNFS.scanFile(video.uri))
      );

      clearSelection();
      onSuccess?.("delete");
      Toast.show({
        type: 'success',
        text1: 'Deleted successfully.',
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
        // onPress: () => console.log('Toast pressed'),
        // onShow: () => console.log('Toast shown'),
        // onHide: () => console.log('Toast hidden'),
      })

    } catch (e) {
      console.log("Failed to delete:", e);
        Toast.error({
          type: 'success',
          text1: 'Failed to delete.',
          // text2: 'Secondary message',
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
          // onPress: () => console.log('Toast pressed'),
          // onShow: () => console.log('Toast shown'),
          // onHide: () => console.log('Toast hidden'),
        })
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  }

  return {
    // states
    hiding,
    deleting,
    showDeleteModal,
    setShowDeleteModal,

    // actions
    hideSelectedVideos,
    unhideSelectedVideos,
    handleConfirmDelete,
  };
}