export const T = {
  bg: '#000000',
  surface: '#1C1C1E',
  card: '#2C2C2E',
  border: '#3A3A3C',
  accent: '#FF3B30',
  accentDim: '#FF3B3022',
  green: '#34C759',
  orange: '#FF9500',
  teal: '#5AC8FA',
  text: '#FFFFFF',
  textSub: '#EBEBF5CC',
  textMuted: '#EBEBF599',
  handleBg: '#FFFFFF',
  timelineB: '#1C1C1E',
};

export const fmtSize = (n: number) =>
  n > 1024 * 1024
    ? (n / 1024 / 1024).toFixed(1) + ' MB'
    : (n / 1024).toFixed(0) + ' KB';

// export const fmtSec = (ms: number) => {
//   const s = Math.max(0, ms / 1000);
//   if (s < 60) return s.toFixed(1) + 's';
//   const m = Math.floor(s / 60),
//     sec = s % 60;
//   return `${m}:${sec.toFixed(1).padStart(4, '0')}`;
// };

export function fmtSec(seconds:number) {
  // if (!seconds || isNaN(seconds)) return '0:00';

  // const h = Math.floor(seconds / 3600);
  // const m = Math.floor((seconds % 3600) / 60);
  // const s = Math.floor(seconds % 60);

  // const ss = s < 10 ? `0${s}` : `${s}`;
  // const mm = h > 0 && m < 10 ? `0${m}` : `${m}`;

  // if (h > 0) return `${h}:${mm}:${ss}`;   // 1:05:09
  // return `${m}:${ss}`;                     // 4:09  (no hours shown if under 60min)
  let sec = seconds/1000
  const duration = new Date(sec * 1000).toISOString().substring(11, 19);

  return duration;
}

export const fmtMs = (ms: number) => (ms / 1000).toFixed(1) + 's';