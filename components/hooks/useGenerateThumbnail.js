import { useCallback, useEffect, useRef, useState } from "react";
import { createThumbnail } from "react-native-create-thumbnail";


export default function useGenerateThumbnail({
  thumbnailTimeMs = 1000,
}) {
  const [thumbMap, setThumbMap] = useState({})
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // ── generate thumbnails ──────────────────────────────────────────────────
  const generateThumb = useCallback(async (video) => {
    const key = video.uri;

    // mark as loading
    setThumbMap(prev => ({
      ...prev,
      [key]: { uri: key, thumbUri: null, loading: true, error: false },
    }));

    try {
      // pick timestamp: 10% into video or thumbnailTimeMs, whichever is smaller
      const timeStamp = video.durationMs
        ? Math.min(thumbnailTimeMs, video.durationMs * 0.1)
        : thumbnailTimeMs;

      const result = await createThumbnail({
        url: key,
        timeStamp,         // ms
        format: 'jpeg',    // 'jpeg' | 'png'
        quality: 0.8,      // 0–1
        dirSize: 100,      // max cache dir size in MB
      });
      
      console.log("THUMBNAIL RESULT: ", result)

    //   if (!mountedRef.current) return;
    //   setThumbMap(prev => ({
    //     ...prev,
    //     [key]: { uri: key, thumbUri: result.path, loading: false, error: false },
    //   }));
    } catch {
    //   if (!mountedRef.current) return;
    //   setThumbMap(prev => ({
    //     ...prev,
    //     [key]: { uri: key, thumbUri: null, loading: false, error: true },
    //   }));
    }
  }, [thumbnailTimeMs]);

  // generate thumbnails for all videos — staggered to avoid hammering the thread
//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       for (const video of videos) {
//         if (cancelled) break;
//         // skip if already generated
//         if (thumbMap[video.uri]?.thumbUri) continue;
//         await generateThumb(video);
//         // small yield between each so the UI stays responsive
//         await new Promise(r => setTimeout(r, 50));
//       }
//     })();
//     return () => { cancelled = true; };
//   }, [videos]);

  // ── render ────────────────────────────────────────────────────────────────
  const renderItem = useCallback(({ item }) => {
    const thumb = thumbMap[item.uri] ?? {
      uri: item.uri,
      thumbUri: null,
      loading: true,
      error: false,
    };
    return thumb
  }, [thumbMap]);

  return {renderItem}
}