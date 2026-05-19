// import { Ionicons } from '@expo/vector-icons';
// import * as VideoThumbnails from 'expo-video-thumbnails';
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   Animated, GestureResponderEvent, Image, Platform,
//   StyleSheet, Text, TouchableOpacity, View,
// } from 'react-native';
// import { fmtSec } from '../constants/theme';

// const HW = 22;
// const BAR_H = 60;
// const BORD = 3;
// const FC = 16;
// const MIN_SEL_MS = 1000;           // 1 second hard floor
// const MAX_ZOOM = 20;
// const TRIM_H_MARGIN = Platform.OS === 'android' ? 20 : 8;

// interface Props {
//   videoUri: string;
//   durationMs: number;
//   trimBarRef?: React.MutableRefObject<{ getRange: () => { startMs: number; endMs: number } } | null>;
//   onSeek?: (ms: number) => void;
//   playheadPos?: number;
// }

// const VideoTrimBar = ({ videoUri, durationMs, trimBarRef, onSeek, playheadPos }: Props) => {
//   const trackWRef = useRef(0);
//   const [trackW, setTrackW] = useState(0);

//   // ── zoom state ────────────────────────────────────────────────────────────
//   const [zoom, setZoom] = useState(1);
//   const zoomRef = useRef(1);
//   const scrollOffsetRef = useRef(0);         // px offset of virtual timeline left edge
//   const [scrollOffset, setScrollOffset] = useState(0);

//   // pinch tracking
//   const pinchStartDist = useRef<number | null>(null);
//   const pinchStartZoom = useRef(1);
//   const pinchMidX = useRef(0);              // midpoint px inside track at pinch start
//   const pinchMidMs = useRef(0);             // ms at that midpoint (anchor while zooming)

//   // ── handle positions (in virtual px space) ────────────────────────────────
//   const aPxL = useRef(new Animated.Value(0)).current;
//   const aPxR = useRef(new Animated.Value(0)).current;
//   const pxL = useRef(0);
//   const pxR = useRef(0);

//   const aTrackW = useRef(new Animated.Value(0)).current;

//   const [frames, setFrames] = useState<(string | null)[]>([]);
//   const [startMs, setStartMs] = useState(0);
//   const [endMs, setEndMs] = useState(durationMs);
//   const startMsRef = useRef(0);
//   const endMsRef = useRef(durationMs);

//   const drag = useRef<'L' | 'R' | 'S' | null>(null);
//   const lastX = useRef(0);
//   const slideSelW = useRef(0);

//   const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

//   // ── coordinate helpers ────────────────────────────────────────────────────
//   // virtual width of the full timeline at current zoom
//   const virtualW = () => trackWRef.current * zoomRef.current;

//   // screen x → virtual px
//   const toVirtual = (screenX: number) => screenX + scrollOffsetRef.current;

//   // virtual px → ms
//   const pxToMs = (vpx: number) =>
//     clamp(Math.round((vpx / Math.max(1, virtualW())) * durationMs), 0, durationMs);

//   // minimum virtual px gap between handles
//   const minPx = () => (MIN_SEL_MS / Math.max(1, durationMs)) * virtualW();

//   // ── scroll helpers ────────────────────────────────────────────────────────
//   const applyScroll = (offset: number) => {
//     const maxOffset = Math.max(0, virtualW() - trackWRef.current);
//     const clamped = clamp(offset, 0, maxOffset);
//     scrollOffsetRef.current = clamped;
//     setScrollOffset(clamped);
//   };

//   const scrollToHandle = (vpx: number) => {
//     const margin = HW + 20;
//     const screenPx = vpx - scrollOffsetRef.current;
//     if (screenPx < margin) {
//       applyScroll(vpx - margin);
//     } else if (screenPx > trackWRef.current - margin) {
//       applyScroll(vpx - (trackWRef.current - margin));
//     }
//   };

//   // ── init ──────────────────────────────────────────────────────────────────
//   const init = (w: number, z = zoomRef.current) => {
//     const vw = w * z;
//     const l = msToPxFromW(startMsRef.current, vw);
//     const r = msToPxFromW(endMsRef.current, vw);
//     pxL.current = l; aPxL.setValue(l);
//     pxR.current = r; aPxR.setValue(r);
//     aTrackW.setValue(vw);
//   };

//   const msToPxFromW = (ms: number, vw: number) =>
//     (ms / Math.max(1, durationMs)) * vw;

//   const onTrackLayout = (w: number) => {
//     trackWRef.current = w;
//     if (w > 0 && pxR.current === 0) {
//       pxR.current = w * zoomRef.current;
//       aPxR.setValue(pxR.current);
//       aTrackW.setValue(w * zoomRef.current);
//     }
//     setTrackW(w);
//   };

//   // ── zoom application ──────────────────────────────────────────────────────
//   const applyZoom = (newZoom: number, anchorScreenX?: number) => {
//     const w = trackWRef.current;
//     if (w <= 0) return;

//     const oldVW = w * zoomRef.current;
//     const newVW = w * newZoom;

//     // anchor point in ms (keep pinch midpoint fixed on screen)
//     const anchorVpx = anchorScreenX != null
//       ? anchorScreenX + scrollOffsetRef.current
//       : (pxL.current + pxR.current) / 2;
//     const anchorMs = clamp(Math.round((anchorVpx / Math.max(1, oldVW)) * durationMs), 0, durationMs);

//     zoomRef.current = newZoom;
//     setZoom(newZoom);

//     // recompute handle positions in new virtual space
//     const newL = msToPxFromW(startMsRef.current, newVW);
//     const newR = msToPxFromW(endMsRef.current, newVW);
//     pxL.current = newL; aPxL.setValue(newL);
//     pxR.current = newR; aPxR.setValue(newR);
//     aTrackW.setValue(newVW);

//     // keep anchor ms at same screen position
//     const newAnchorVpx = msToPxFromW(anchorMs, newVW);
//     const desiredOffset = newAnchorVpx - (anchorScreenX ?? w / 2);
//     applyScroll(desiredOffset);
//   };

//   // ── effects ───────────────────────────────────────────────────────────────
//   useEffect(() => {
//     setStartMs(0);
//     setEndMs(durationMs);
//     startMsRef.current = 0;
//     endMsRef.current = durationMs;
//     const w = trackWRef.current;
//     if (w > 0) init(w);
//   }, [durationMs]);

//   useEffect(() => {
//     if (!videoUri || durationMs <= 0) return;
//     setFrames(Array(FC).fill(null));
//     let cancelled = false;
//     (async () => {
//       await Promise.all(Array.from({ length: FC }).map(async (_, i) => {
//         if (cancelled) return;
//         try {
//           const t = Math.round((i / Math.max(1, FC - 1)) * Math.max(0, durationMs - 100));
//           const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, { time: t, quality: 0.4 });
//           if (!cancelled && uri)
//             setFrames(p => { const n = [...p]; n[i] = uri; return n; });
//         } catch {}
//       }));
//     })();
//     return () => { cancelled = true; };
//   }, [videoUri, durationMs]);

//   // ── getRange ──────────────────────────────────────────────────────────────
//   const getRange = () => ({
//     startMs: clamp(startMsRef.current, 0, durationMs),
//     endMs:   clamp(endMsRef.current,   0, durationMs),
//   });
//   useEffect(() => { if (trimBarRef) trimBarRef.current = { getRange }; });

//   // loop within cut
//   useEffect(() => {
//     if (playheadPos == null || durationMs <= 0) return;
//     const cur = playheadPos * durationMs;
//     if (cur >= endMsRef.current && endMsRef.current > startMsRef.current)
//       onSeek?.(startMsRef.current);
//   }, [playheadPos]);

//   // ── gesture helpers ───────────────────────────────────────────────────────
//   const getPointerDist = (e: GestureResponderEvent) => {
//     const touches = e.nativeEvent.touches;
//     if (!touches || touches.length < 2) return null;
//     const dx = touches[0].pageX - touches[1].pageX;
//     const dy = touches[0].pageY - touches[1].pageY;
//     return Math.sqrt(dx * dx + dy * dy);
//   };

//   const getPointerMid = (e: GestureResponderEvent) => {
//     const touches = e.nativeEvent.touches;
//     if (!touches || touches.length < 2) return null;
//     return (touches[0].locationX + touches[1].locationX) / 2;
//   };

//   // ── responder ─────────────────────────────────────────────────────────────
//   const onGrant = (e: GestureResponderEvent) => {
//     const touches = e.nativeEvent.touches;

//     if (touches && touches.length >= 2) {
//       // begin pinch
//       const dist = getPointerDist(e);
//       const mid  = getPointerMid(e);
//       if (dist != null) { pinchStartDist.current = dist; pinchStartZoom.current = zoomRef.current; }
//       if (mid  != null) { pinchMidX.current = mid; pinchMidMs.current = pxToMs(toVirtual(mid)); }
//       drag.current = null;
//       return;
//     }

//     const x = e.nativeEvent.locationX;
//     const vx = toVirtual(x);
//     const l = pxL.current, r = pxR.current;
//     const onL = vx >= l - 4 && vx <= l + HW;
//     const onR = vx >= r - HW && vx <= r + 4;
//     const onS = !onL && !onR && vx > l && vx < r;
//     if (onL && onR) {
//       drag.current = Math.abs(vx - (l + HW / 2)) <= Math.abs(vx - (r - HW / 2)) ? 'L' : 'R';
//     } else if (onL)  { drag.current = 'L';
//     } else if (onR)  { drag.current = 'R';
//     } else if (onS)  { drag.current = 'S'; lastX.current = vx; slideSelW.current = r - l;
//     } else           { drag.current = null; }
//   };

//   const onMove = (e: GestureResponderEvent) => {
//     const touches = e.nativeEvent.touches;

//     // ── pinch zoom ──
//     if (touches && touches.length >= 2 && pinchStartDist.current != null) {
//       const dist = getPointerDist(e);
//       const mid  = getPointerMid(e);
//       if (dist == null) return;
//       const scale = dist / pinchStartDist.current;
//       const newZoom = clamp(pinchStartZoom.current * scale, 1, MAX_ZOOM);
//       applyZoom(newZoom, mid ?? pinchMidX.current);
//       return;
//     }

//     if (!drag.current) return;
//     const x  = e.nativeEvent.locationX;
//     const vx = toVirtual(x);
//     const w  = trackWRef.current;
//     if (w <= 0) return;
//     const mp = minPx();
//     const vw = virtualW();

//     if (drag.current === 'L') {
//       const newL = clamp(vx, 0, pxR.current - mp - HW * 2)
//       pxL.current = newL; aPxL.setValue(newL);
//       const ms = pxToMs(newL);
//       startMsRef.current = ms;
//       setStartMs(ms);
//       onSeek?.(ms);
//       scrollToHandle(newL);
//     } else if (drag.current === 'R') {
//       const newR = clamp(vx, pxL.current + mp + HW * 2, vw);
//       pxR.current = newR; aPxR.setValue(newR);
//       const ms = pxToMs(newR);
//       endMsRef.current = ms; setEndMs(ms); onSeek?.(ms);
//       scrollToHandle(newR);
//     } else {
      
//       const dx  = vx - lastX.current;
//       const sw  = slideSelW.current;
//       const newL = clamp(pxL.current + dx, 0, vw - sw);
//       const newR = newL + sw;
//       pxL.current = newL; aPxL.setValue(newL);
//       pxR.current = newR; aPxR.setValue(newR);
//       const sMs = pxToMs(newL), eMs = pxToMs(newR);
//       startMsRef.current = sMs; setStartMs(sMs);
//       endMsRef.current   = eMs; setEndMs(eMs);
//       onSeek?.(sMs);
//       lastX.current = vx;
//       scrollToHandle(newL + sw / 2);
//     }
//   };

//   const onRelease = () => {
//     pinchStartDist.current = null;
//     drag.current = null;
//     const r = getRange();
//     setStartMs(r.startMs);
//     setEndMs(r.endMs);
//   };

//   // ── playhead (screen space) ───────────────────────────────────────────────
//   const cutPh = (() => {
//     if (endMsRef.current <= startMsRef.current) return pxL.current - scrollOffset + HW;
//     const cur  = (playheadPos ?? 0) * durationMs;
//     const frac = (cur - startMsRef.current) / (endMsRef.current - startMsRef.current);
//     const vPx  = pxL.current + HW + frac * (pxR.current - HW - (pxL.current + HW));
//     return clamp(vPx - scrollOffset, pxL.current - scrollOffset + HW, pxR.current - scrollOffset - HW);
//   })();

//   const selectedDurMs = Math.max(0, endMs - startMs);

//   // screen-space positions for rendering
//   const sL  = Math.min(pxL.current, pxR.current - HW * 2) - scrollOffset;
//   const sR  = Math.max(pxR.current, pxL.current + HW * 2) - scrollOffset;
//   const sHR = sR - HW;
//   return (
//     <View style={s.container}>
//       <View style={s.headerRow}>
//         <Text style={s.hint}>{fmtSec(selectedDurMs)}</Text>
//         {/* Zoom indicator */}
//         <Text style={s.zoomLabel}>{zoom.toFixed(1)}×</Text>
//       </View>

//       {/* ── trim bar ── */}
//       <View
//         style={s.trackOuter}
//         onLayout={e => onTrackLayout(e.nativeEvent.layout.width)}
//         onStartShouldSetResponder={() => true}
//         onStartShouldSetResponderCapture={() => true}
//         onMoveShouldSetResponder={() => true}
//         onMoveShouldSetResponderCapture={() => true}
//         onResponderGrant={onGrant}
//         onResponderMove={onMove}
//         onResponderRelease={onRelease}
//         onResponderTerminate={onRelease}
//       >
//         {/* Thumbnail strip — scrolled inside clip */}
//         <View
//           pointerEvents="none"
//           style={[s.framesRow, { width: trackW * zoom, left: -scrollOffset, height: BAR_H }]}
//         >
//           {Array.from({ length: FC }).map((_, i) => (
//             <View key={i} style={s.frameCell}>
//               {frames[i]
//                 ? <Image source={{ uri: frames[i]! }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
//                 : <View style={{ flex: 1, backgroundColor: '#1A1A1A' }} />}
//             </View>
//           ))}
//         </View>

//         {trackW > 0 && (<>
//           {/* dim left */}
//           <View pointerEvents="none" style={[s.dimOverlay, { left: 0, width: Math.max(0, sL) }]} />
//           {/* dim right */}
//           <View pointerEvents="none" style={[s.dimOverlay, { left: Math.max(0, sR), right: 0 }]} />
//           {/* top / bottom selection borders */}
//           <View pointerEvents="none" style={{ position: 'absolute', top: 0, height: BORD, left: sL + HW, right: Math.max(0, trackW - sR + HW), backgroundColor: '#FFF', zIndex: 3 }} />
//           <View pointerEvents="none" style={{ position: 'absolute', bottom: 0, height: BORD, left: sL + HW, right: Math.max(0, trackW - sR + HW), backgroundColor: '#FFF', zIndex: 3 }} />
//           {/* left handle */}
//           <View pointerEvents="none" style={[s.handle, { left: sL }]}>
//             <Ionicons name="chevron-back" size={13} color="#1C1C1E" />
//           </View>
//           {/* right handle */}
//           <View pointerEvents="none" style={[s.handle, { left: sHR }]}>
//             <Ionicons name="chevron-forward" size={13} color="#1C1C1E" />
//           </View>
//           {/* playhead */}
//           <View pointerEvents="none" style={{ position: 'absolute', top: BORD, bottom: BORD, left: cutPh - 1, width: 2, zIndex: 9, backgroundColor: 'green', borderRadius: 1 }} />
//         </>)}
//       </View>

//       {/* ── zoom slider ── */}
//       <View style={s.zoomRow}>
//         <TouchableOpacity
//           style={s.zoomBtn}
//           onPress={() => applyZoom(Math.max(1, parseFloat((zoom - 0.5).toFixed(1))))}
//         >
//           <Ionicons name="remove" size={18} color="#FFF" />
//         </TouchableOpacity>

//         <Text style={s.zoomLabel}>{zoom.toFixed(1)}×</Text>

//         <TouchableOpacity
//           style={s.zoomBtn}
//           onPress={() => applyZoom(Math.min(MAX_ZOOM, parseFloat((zoom + 0.5).toFixed(1))))}
//         >
//           <Ionicons name="add" size={18} color="#FFF" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// /** Thin zoom thumb component to avoid nested responder conflict */
// const ZoomThumb = ({
//   zoom, maxZoom, onZoomChange,
// }: { zoom: number; maxZoom: number; onZoomChange: (z: number) => void }) => {
//   const trackW = useRef(0);
//   const startX = useRef(0);
//   const startZ = useRef(zoom);

//   return (
//     <View
//       style={[zt.thumb, { left: `${((zoom - 1) / (maxZoom - 1)) * 100}%` }]}
//       onLayout={e => { trackW.current = e.nativeEvent.layout.width; }}
//       onStartShouldSetResponder={() => true}
//       onMoveShouldSetResponder={() => true}
//       onResponderGrant={e => { startX.current = e.nativeEvent.pageX; startZ.current = zoom; }}
//       onResponderMove={e => {
//         const dx  = e.nativeEvent.pageX - startX.current;
//         const pw  = trackW.current || 1;
//         const dz  = (dx / pw) * (maxZoom - 1);
//         onZoomChange(Math.max(1, Math.min(maxZoom, startZ.current + dz)));
//       }}
//     />
//   );
// };

// const zt = StyleSheet.create({
//   thumb: {
//     position: 'absolute',
//     width: 18, height: 18,
//     borderRadius: 9,
//     backgroundColor: '#FFF',
//     top: -7,
//     marginLeft: -9,
//   },
// });

// const s = StyleSheet.create({
//   container: {
//     backgroundColor: '#000',
//     paddingBottom: Platform.OS === 'ios' ? 6 : 4,
//     paddingTop: 12,
//   },
//   headerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     marginBottom: 10,
//   },
//   hint: {
//     color: '#EBEBF5CC',
//     fontSize: 13,
//     fontWeight: '500',
//   },
//   trackOuter: {
//     marginHorizontal: TRIM_H_MARGIN,
//     height: BAR_H,
//     position: 'relative',
//     borderRadius: 4,
//     overflow: 'hidden',
//   },
//   framesRow: {
//     flexDirection: 'row',
//     position: 'absolute',
//     top: 0,
//     overflow: 'hidden',
//   },
//   frameCell: {
//     flex: 1,
//     overflow: 'hidden',
//     borderRightWidth: 1,
//     borderColor: 'rgba(0,0,0,0.2)',
//   },
//   dimOverlay: {
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.55)',
//     zIndex: 2,
//   },
//   handle: {
//     position: 'absolute',
//     top: 0,
//     width: HW,
//     height: BAR_H,
//     zIndex: 10,
//     backgroundColor: '#FFF',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   sliderTrack: {
//     flex: 1,
//     height: 4,
//     backgroundColor: 'rgba(255,255,255,0.15)',
//     borderRadius: 2,
//     position: 'relative',
//     justifyContent: 'center',
//   },
//   sliderFill: {
//     height: 4,
//     backgroundColor: 'rgba(255,255,255,0.5)',
//     borderRadius: 2,
//   },
//   zoomRow: {
//   flexDirection: 'row',
//   alignItems: 'center',
//   justifyContent: 'center',
//   paddingHorizontal: 16,
//   marginTop: 14,
//   gap: 20,
// },
// zoomLabel: {
//   color: '#EBEBF5CC',
//   fontSize: 13,
//   fontWeight: '500',
//   minWidth: 40,
//   textAlign: 'center',
// },
// zoomBtn: {
//   width: 36,
//   height: 36,
//   borderRadius: 18,
//   backgroundColor: 'rgba(255,255,255,0.12)',
//   alignItems: 'center',
//   justifyContent: 'center',
// },
// });

// export default VideoTrimBar;
import { Ionicons } from '@expo/vector-icons';
import * as VideoThumbnails from 'expo-video-thumbnails';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  GestureResponderEvent,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { fmtSec } from '../constants/theme';

const HW = 22;
const BAR_H = 60;
const BORD = 3;
const FC = 16;
const MIN_SEL_MS = 1000;
const MAX_ZOOM = 20;
const TRIM_H_MARGIN = Platform.OS === 'android' ? 20 : 8;

interface Props {
  videoUri: string;
  durationMs: number;
  trimBarRef?: React.MutableRefObject<{ getRange: () => { startMs: number; endMs: number } } | null>;
  onSeek?: (ms: number) => void;
  playheadPos?: number;
}

const VideoTrimBar = ({ videoUri, durationMs, trimBarRef, onSeek, playheadPos }: Props) => {
  // ── layout ────────────────────────────────────────────────────────────────
  const trackWRef = useRef(0);
  const [trackW, setTrackW] = useState(0);

  // ── zoom / scroll (refs only — no setState in hot path) ───────────────────
  const zoomRef = useRef(1);
  const scrollRef = useRef(0);
  const [zoom, setZoom] = useState(1);          // display only
  const [selectedDurMs, setSelectedDurMs] = useState(durationMs);

  // ── handle positions — Animated values drive ALL rendering ────────────────
  // These live in virtual-px space; we subtract aScroll to get screen-px.
  const aVpxL   = useRef(new Animated.Value(0)).current;   // left handle virtual px
  const aVpxR   = useRef(new Animated.Value(0)).current;   // right handle virtual px
  const aScroll  = useRef(new Animated.Value(0)).current;   // scroll offset
  const aVirtW   = useRef(new Animated.Value(0)).current;   // virtual width (trackW * zoom)
  const aPlayhead = useRef(new Animated.Value(0)).current;  // screen-px playhead

  // Screen-px derived values (no JS thread involvement during animation)
  const aScreenL  = Animated.subtract(aVpxL,  aScroll);
  const aScreenR  = Animated.subtract(aVpxR,  aScroll);
  const aScreenHR = Animated.subtract(aScreenR, new Animated.Value(HW));

  // Dim overlays
  const aDimLW  = aScreenL;                                        // left dim width
  const aDimRLeft = aScreenR;                                      // right dim starts here
  const aDimRW  = Animated.subtract(aVirtW, aVpxR);               // right dim width (virtual)

  // Selection borders (inner span)
  const aBorderL = Animated.add(aScreenL, new Animated.Value(HW));
  const aBorderW = Animated.subtract(
    Animated.subtract(aScreenR, new Animated.Value(HW)),
    Animated.add(aScreenL, new Animated.Value(HW))
  );

  // Mutable mirror of Animated values for gesture math (no getValue() in hot path)
  const pxL = useRef(0);
  const pxR = useRef(0);
  const startMsRef = useRef(0);
  const endMsRef   = useRef(durationMs);

  // ── drag state ────────────────────────────────────────────────────────────
  const drag        = useRef<'L' | 'R' | 'S' | null>(null);
  const lastVx      = useRef(0);
  const slideSelW   = useRef(0);

  // ── pinch state ───────────────────────────────────────────────────────────
  const pinchDist0  = useRef<number | null>(null);
  const pinchZoom0  = useRef(1);
  const pinchMidX   = useRef(0);

  // ── frames ────────────────────────────────────────────────────────────────
  const [frames, setFrames] = useState<(string | null)[]>(Array(FC).fill(null));

  // ── helpers ───────────────────────────────────────────────────────────────
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
  const vw    = () => trackWRef.current * zoomRef.current;
  const toVx  = (sx: number) => sx + scrollRef.current;
  const minPx = () => (MIN_SEL_MS / Math.max(1, durationMs)) * vw();
  const msToPx = (ms: number, virtualWidth = vw()) =>
    (ms / Math.max(1, durationMs)) * virtualWidth;
  const pxToMsSnap = (px: number, virtualWidth = vw()) =>
    clamp(Math.round((px / Math.max(1, virtualWidth)) * durationMs), 0, durationMs);

  // ── Animated sync (single helper — sets both ref mirror and Animated value) 
  const setL = (px: number) => { pxL.current = px; aVpxL.setValue(px); };
  const setR = (px: number) => { pxR.current = px; aVpxR.setValue(px); };
  const setScroll = (offset: number) => {
    const max = Math.max(0, vw() - trackWRef.current);
    const clamped = clamp(offset, 0, max);
    scrollRef.current = clamped;
    aScroll.setValue(clamped);
  };

  // ── scroll-to-handle (keeps active handle visible) ────────────────────────
  const scrollToHandle = (vpx: number) => {
    const margin   = HW + 20;
    const screenPx = vpx - scrollRef.current;
    if (screenPx < margin)
      setScroll(vpx - margin);
    else if (screenPx > trackWRef.current - margin)
      setScroll(vpx - (trackWRef.current - margin));
  };

  // ── init (reset handles to current ms positions) ──────────────────────────
  const init = useCallback((w: number, z = zoomRef.current) => {
    const virtualWidth = w * z;
    setL(msToPx(startMsRef.current, virtualWidth));
    setR(msToPx(endMsRef.current,   virtualWidth));
    aVirtW.setValue(virtualWidth);
  }, [durationMs]);

  const onTrackLayout = (w: number) => {
    trackWRef.current = w;
    if (w > 0 && pxR.current === 0) {
      setR(w * zoomRef.current);
      aVirtW.setValue(w * zoomRef.current);
    }
    setTrackW(w);
  };

  // ── apply zoom (reposition handles, keep anchor ms fixed on screen) ────────
  const applyZoom = useCallback((newZoom: number, anchorSx?: number) => {
    const w = trackWRef.current;
    if (w <= 0) return;

    const oldVW = vw();
    const newVW = w * newZoom;

    const anchorVpx = anchorSx != null
      ? anchorSx + scrollRef.current
      : (pxL.current + pxR.current) / 2;
    const anchorMs = clamp(Math.round((anchorVpx / Math.max(1, oldVW)) * durationMs), 0, durationMs);

    zoomRef.current = newZoom;

    const newL = msToPx(startMsRef.current, newVW);
    const newR = msToPx(endMsRef.current,   newVW);
    setL(newL);
    setR(newR);
    aVirtW.setValue(newVW);

    const newAnchorVpx = msToPx(anchorMs, newVW);
    setScroll(newAnchorVpx - (anchorSx ?? w / 2));

    setZoom(newZoom); // display only, safe to call outside hot path
  }, [durationMs]);

  // ── effects ───────────────────────────────────────────────────────────────
  useEffect(() => {
    startMsRef.current = 0;
    endMsRef.current   = durationMs;
    setSelectedDurMs(durationMs);
    const w = trackWRef.current;
    if (w > 0) init(w);
  }, [durationMs]);

  useEffect(() => {
    if (!videoUri || durationMs <= 0) return;
    setFrames(Array(FC).fill(null));
    let cancelled = false;
    (async () => {
      await Promise.all(
        Array.from({ length: FC }).map(async (_, i) => {
          if (cancelled) return;
          try {
            const t = Math.round((i / Math.max(1, FC - 1)) * Math.max(0, durationMs - 100));
            const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, { time: t, quality: 0.4 });
            if (!cancelled && uri)
              setFrames(p => { const n = [...p]; n[i] = uri; return n; });
          } catch {}
        })
      );
    })();
    return () => { cancelled = true; };
  }, [videoUri, durationMs]);

  // ── playhead (Animated, no setState) ─────────────────────────────────────
  useEffect(() => {
    if (playheadPos == null || durationMs <= 0) return;
    const cur = playheadPos * durationMs;

    // loop back
    if (cur >= endMsRef.current && endMsRef.current > startMsRef.current) {
      onSeek?.(startMsRef.current);
      return;
    }

    const selMs = endMsRef.current - startMsRef.current;
    if (selMs <= 0) return;
    const frac  = (cur - startMsRef.current) / selMs;
    const inner = pxR.current - HW - (pxL.current + HW);
    const vpx   = pxL.current + HW + frac * inner;
    const spx   = clamp(vpx - scrollRef.current, pxL.current - scrollRef.current + HW, pxR.current - scrollRef.current - HW);
    aPlayhead.setValue(spx);
  }, [playheadPos]);

  // ── getRange ──────────────────────────────────────────────────────────────
  const getRange = useCallback(() => ({
    startMs: clamp(startMsRef.current, 0, durationMs),
    endMs:   clamp(endMsRef.current,   0, durationMs),
  }), [durationMs]);

  useEffect(() => { if (trimBarRef) trimBarRef.current = { getRange }; });

  // ── gesture helpers ───────────────────────────────────────────────────────
  const pointerDist = (e: GestureResponderEvent) => {
    const t = e.nativeEvent.touches;
    if (!t || t.length < 2) return null;
    const dx = t[0].pageX - t[1].pageX, dy = t[0].pageY - t[1].pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };
  const pointerMidX = (e: GestureResponderEvent) => {
    const t = e.nativeEvent.touches;
    if (!t || t.length < 2) return null;
    return (t[0].locationX + t[1].locationX) / 2;
  };

  // ── responder ─────────────────────────────────────────────────────────────
  const onGrant = (e: GestureResponderEvent) => {
    const t = e.nativeEvent.touches;
    if (t && t.length >= 2) {
      const d = pointerDist(e), m = pointerMidX(e);
      if (d != null) { pinchDist0.current = d; pinchZoom0.current = zoomRef.current; }
      if (m != null) pinchMidX.current = m;
      drag.current = null;
      return;
    }
    const vx = toVx(e.nativeEvent.locationX);
    const l = pxL.current, r = pxR.current;
    const onL = vx >= l - 4 && vx <= l + HW;
    const onR = vx >= r - HW && vx <= r + 4;
    const onS = !onL && !onR && vx > l && vx < r;
    if      (onL && onR) drag.current = Math.abs(vx - (l + HW / 2)) <= Math.abs(vx - (r - HW / 2)) ? 'L' : 'R';
    else if (onL)        drag.current = 'L';
    else if (onR)        drag.current = 'R';
    else if (onS)        { drag.current = 'S'; lastVx.current = vx; slideSelW.current = r - l; }
    else                 drag.current = null;
  };

  const onMove = (e: GestureResponderEvent) => {
    // ── pinch ──
    const t = e.nativeEvent.touches;
    if (t && t.length >= 2 && pinchDist0.current != null) {
      const d = pointerDist(e);
      if (d == null) return;
      const newZoom = clamp(pinchZoom0.current * (d / pinchDist0.current), 1, MAX_ZOOM);
      applyZoom(newZoom, pointerMidX(e) ?? pinchMidX.current);
      return;
    }

    if (!drag.current) return;
    const vx       = toVx(e.nativeEvent.locationX);
    const virtualW = vw();
    if (virtualW <= 0) return;
    const mp       = minPx();

    if (drag.current === 'L') {
      const newL = clamp(vx, 0, pxR.current - mp - HW * 2);
      setL(newL);
      const ms = pxToMsSnap(newL, virtualW);
      startMsRef.current = ms;
      onSeek?.(ms);
      scrollToHandle(newL);

    } else if (drag.current === 'R') {
      const newR = clamp(vx, pxL.current + mp + HW * 2, virtualW);
      setR(newR);
      const ms = pxToMsSnap(newR, virtualW);
      endMsRef.current = ms;
      onSeek?.(ms);
      scrollToHandle(newR);

    } else {
      const dx   = vx - lastVx.current;
      const sw   = slideSelW.current;
      const newL = clamp(pxL.current + dx, 0, virtualW - sw);
      const newR = newL + sw;
      setL(newL);
      setR(newR);
      startMsRef.current = pxToMsSnap(newL, virtualW);
      endMsRef.current   = pxToMsSnap(newR, virtualW);
      onSeek?.(startMsRef.current);
      lastVx.current = vx;
      scrollToHandle(newL + sw / 2);
    }

    // Batch the display update — one setState per gesture frame, not two
    setSelectedDurMs(Math.max(0, endMsRef.current - startMsRef.current));
  };

  const onRelease = () => {
    pinchDist0.current = null;
    drag.current = null;
    // Final display sync
    setSelectedDurMs(Math.max(0, endMsRef.current - startMsRef.current));
  };

  return (
    <View style={s.container}>
      <View style={s.headerRow}>
        <Text style={s.hint}>{fmtSec(selectedDurMs)}</Text>
        <Text style={s.zoomLabel}>{zoom.toFixed(1)}×</Text>
      </View>

      {/* ── trim bar ── */}
      <View
        style={s.trackOuter}
        onLayout={e => onTrackLayout(e.nativeEvent.layout.width)}
        onStartShouldSetResponder={() => true}
        onStartShouldSetResponderCapture={() => true}
        onMoveShouldSetResponder={() => true}
        onMoveShouldSetResponderCapture={() => true}
        onResponderGrant={onGrant}
        onResponderMove={onMove}
        onResponderRelease={onRelease}
        onResponderTerminate={onRelease}
      >
        {/* Thumbnail strip */}
        <View
          pointerEvents="none"
          style={[s.framesRow, { height: BAR_H }]}
        >
          {Array.from({ length: FC }).map((_, i) => (
            <View key={i} style={[s.frameCell, { width: (trackW * zoom) / FC }]}>
              {frames[i]
                ? <Image source={{ uri: frames[i]! }} style={s.frameImg} resizeMode="cover" />
                : <View style={s.framePlaceholder} />}
            </View>
          ))}
        </View>

        {trackW > 0 && (<>
          {/* Left dim */}
          <Animated.View pointerEvents="none" style={[s.dimOverlay, { left: 0, width: aDimLW }]} />
          {/* Right dim */}
          <Animated.View pointerEvents="none" style={[s.dimOverlay, { left: aDimRLeft, right: 0 }]} />
          {/* Top border */}
          <Animated.View pointerEvents="none" style={[s.selBorder, { top: 0, left: aBorderL, width: aBorderW }]} />
          {/* Bottom border */}
          <Animated.View pointerEvents="none" style={[s.selBorder, { bottom: 0, left: aBorderL, width: aBorderW }]} />
          {/* Left handle */}
          <Animated.View pointerEvents="none" style={[s.handle, { left: aScreenL }]}>
            <Ionicons name="chevron-back" size={13} color="#1C1C1E" />
          </Animated.View>
          {/* Right handle */}
          <Animated.View pointerEvents="none" style={[s.handle, { left: aScreenHR }]}>
            <Ionicons name="chevron-forward" size={13} color="#1C1C1E" />
          </Animated.View>
          {/* Playhead */}
          <Animated.View pointerEvents="none" style={[s.playhead, { left: aPlayhead }]} />
        </>)}
      </View>

      {/* ── zoom buttons ── */}
      <View style={s.zoomRow}>
        <TouchableOpacity
          style={s.zoomBtn}
          onPress={() => applyZoom(Math.max(1, parseFloat((zoom - 0.5).toFixed(1))))}
        >
          <Ionicons name="remove" size={18} color="#FFF" />
        </TouchableOpacity>
        <Text style={s.zoomLabel}>{zoom.toFixed(1)}×</Text>
        <TouchableOpacity
          style={s.zoomBtn}
          onPress={() => applyZoom(Math.min(MAX_ZOOM, parseFloat((zoom + 0.5).toFixed(1))))}
        >
          <Ionicons name="add" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    paddingBottom: Platform.OS === 'ios' ? 6 : 4,
    paddingTop: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  hint: {
    color: '#EBEBF5CC',
    fontSize: 13,
    fontWeight: '500',
  },
  trackOuter: {
    marginHorizontal: TRIM_H_MARGIN,
    height: BAR_H,
    position: 'relative',
    borderRadius: 4,
    overflow: 'hidden',
  },
  framesRow: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  frameCell: {
    overflow: 'hidden',
    borderRightWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    height: BAR_H,
  },
  frameImg: {
    width: '100%',
    height: '100%',
  },
  framePlaceholder: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  dimOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    zIndex: 2,
  },
  selBorder: {
    position: 'absolute',
    height: BORD,
    backgroundColor: '#FFF',
    zIndex: 3,
  },
  handle: {
    position: 'absolute',
    top: 0,
    width: HW,
    height: BAR_H,
    zIndex: 10,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playhead: {
    position: 'absolute',
    top: BORD,
    bottom: BORD,
    width: 2,
    zIndex: 9,
    backgroundColor: '#FFF',
    borderRadius: 1,
  },
  zoomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 14,
    gap: 20,
  },
  zoomLabel: {
    color: '#EBEBF5CC',
    fontSize: 13,
    fontWeight: '500',
    minWidth: 40,
    textAlign: 'center',
  },
  zoomBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default VideoTrimBar;