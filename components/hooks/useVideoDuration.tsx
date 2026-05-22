import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';

type DurationMap = Record<string, number | null>;

export function useVideoDurations(uris: string[]) {
  const [durations, setDurations] = useState<DurationMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      const results = await Promise.allSettled(
        uris.map(async (uri) => {
          const { sound, status } = await Audio.Sound.createAsync(
            { uri },
            { shouldPlay: false }
          );
          await sound.unloadAsync(); // free memory immediately
          const ms = status.isLoaded ? status.durationMillis ?? null : null;
          return { uri, ms };
        })
      );

      if (cancelled) return;

      const map: DurationMap = {};
      results.forEach((r) => {
        if (r.status === 'fulfilled') {
          map[r.value.uri] = r.value.ms;
        }
      });

      console.log('Loaded durations:', map);
      setDurations(map);
      setLoading(false);
    }

    loadAll();
    return () => { cancelled = true; };
  }, [uris.join(',')]);

  return { durations, loading };
}