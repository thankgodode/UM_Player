import { createVideoPlayer } from 'expo-video';

export const fetchDuration = (uri) => {
  return new Promise((resolve) => {
    const player = createVideoPlayer({ uri });

    const subscription = player.addListener('statusChange', (status) => {
      if (player.duration > 0) {
        subscription.remove();
        player.release(); // Free memory
        resolve(player.duration); // Duration in seconds
      }
    });
  });
};