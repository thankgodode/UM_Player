/**
 * ╔══════════════════════════════════════════════╗
 * ║          VIDEO TRIM FEATURE                  ║
 * ║  Dual-handle range slider + save via ffmpeg  ║
 * ╚══════════════════════════════════════════════╝
 *
 * WHAT THIS FILE CONTAINS:
 *  1. TrimSlider   — the dual-handle UI component
 *  2. TrimModal    — full trim screen with preview
 *  3. trimVideo()  — the actual trim + save function
 *
 * INSTALL REQUIRED PACKAGES:
 *   npm install ffmpeg-kit-react-native
 *   npm install @react-native-community/slider
 *   npm install react-native-fs
 *
 * iOS — add to Podfile:
 *   pod 'ffmpeg-kit-react-native', :subspecs => ['min']
 *   then: cd ios && pod install
 *
 * Android — works out of the box after npm install + rebuild
 *
 * HOW TO ADD TO YOUR EXISTING VideoPlayer:
 *
 *   // 1. Import at top of VideoPlayer.js
 *   import TrimModal from './TrimModal';
 *
 *   // 2. Add state
 *   const [showTrim, setShowTrim] = useState(false);
 *
 *   // 3. Add trim button in your top bar
 *   <TouchableOpacity onPress={() => { setPaused(true); setShowTrim(true); }}>
 *     <Text>✂️</Text>
 *   </TouchableOpacity>
 *
 *   // 4. Add modal at the bottom of your VideoPlayer return()
 *   <TrimModal
 *     visible={showTrim}
 *     source={source}
 *     duration={duration}        // in seconds (from onLoad)
 *     onClose={() => setShowTrim(false)}
 *     onSaved={(savedPath) => {
 *       console.log('Saved to:', savedPath);
 *       setShowTrim(false);
 *     }}
 *   />
 */

import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import RNFS from 'react-native-fs';
import Video from 'react-native-video';

const { width: SCREEN_W } = Dimensions.get('window');
const TRACK_PADDING = 24;          // horizontal padding on each side
const TRACK_WIDTH = SCREEN_W - TRACK_PADDING * 2;
const HANDLE_W = 20;               // width of each drag handle

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function formatDuration(secs) {
  if (!secs || isNaN(secs)) return '0s';
  if (secs < 60) return `${Math.round(secs)}s`;
  return `${Math.floor(secs / 60)}m ${Math.round(secs % 60)}s`;
}

// ─── trimVideo — the core save function ──────────────────────────────────────

/**
 * Trims a video using FFmpeg and saves it to the device.
 *
 * @param {string} inputUri   - source video URI (file:// or http://)
 * @param {number} startSec   - trim start in seconds
 * @param {number} endSec     - trim end in seconds
 * @param {function} onProgress - called with 0-100 progress number
 * @returns {string} path of the saved file
 */
export async function trimVideo(inputUri, startSec, endSec, onProgress) {
  // build output path in the device's document directory
  const timestamp  = Date.now();
  const outputPath = `${RNFS.DocumentDirectoryPath}/trimmed_${timestamp}.mp4`;
  const duration   = endSec - startSec;

  // ffmpeg command:
  // -ss      = start time (seek BEFORE input = fast)
  // -i       = input file
  // -t       = duration to keep
  // -c copy  = no re-encode = instant + lossless quality
  const command = `-ss ${startSec} -i "${inputUri}" -t ${duration} -c copy "${outputPath}"`;

  console.log('[TrimVideo] Running:', command);

  return new Promise((resolve, reject) => {
    FFmpegKit.executeAsync(
      command,
      // completion callback
      async (session) => {
        const returnCode = await session.getReturnCode();
        if (ReturnCode.isSuccess(returnCode)) {
          console.log('[TrimVideo] Success:', outputPath);
          resolve(outputPath);
        } else {
          const logs = await session.getAllLogsAsString();
          console.error('[TrimVideo] Failed:', logs);
          reject(new Error('FFmpeg trim failed'));
        }
      },
      // log callback (unused but required)
      () => {},
      // statistics callback → derive progress
      (stats) => {
        if (onProgress && duration > 0) {
          const processed = stats.getTime() / 1000; // ms → s
          const pct = Math.min(100, Math.round((processed / duration) * 100));
          onProgress(pct);
        }
      }
    );
  });
}

// ─── TrimSlider — dual handle range component ─────────────────────────────────

function TrimSlider({ duration, startSec, endSec, onStartChange, onEndChange, currentTime }) {
  const trackRef = useRef(null);

  // convert seconds → pixel position on the track
  const secToPx = (s) => (s / duration) * TRACK_WIDTH;
  // convert pixel offset → seconds
  const pxToSec = (px) => Math.max(0, Math.min(duration, (px / TRACK_WIDTH) * duration));

  const startPx = secToPx(startSec);
  const endPx   = secToPx(endSec);
  const playPx  = secToPx(currentTime);

  // ── left (start) handle pan ───────────────────────────────────────────────
  const startPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        console.log(evt)
      },
      
      onPanResponderMove: (_, g) => {
        const newSec = pxToSec(startPx + g.dx);
        // keep at least 1s gap from end handle
        if (newSec < endSec - 1) onStartChange(parseFloat(newSec.toFixed(2)));
      },
    })
  ).current;

  // ── right (end) handle pan ────────────────────────────────────────────────
  const endPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {},
      onPanResponderMove: (_, g) => {
        const newSec = pxToSec(endPx + g.dx);
        // keep at least 1s gap from start handle
        if (newSec > startSec + 1) onEndChange(parseFloat(newSec.toFixed(2)));
      },
    })
  ).current;

  return (
    <View style={trimStyles.sliderContainer}>

      {/* time labels above handles */}
      <View style={[trimStyles.timeLabel, { left: TRACK_PADDING + startPx - 18 }]}>
        <Text style={trimStyles.timeLabelText}>{formatTime(startSec)}</Text>
      </View>
      <View style={[trimStyles.timeLabel, { left: TRACK_PADDING + endPx - 18 }]}>
        <Text style={trimStyles.timeLabelText}>{formatTime(endSec)}</Text>
      </View>

      {/* track row */}
      <View style={trimStyles.trackRow} ref={trackRef}>

        {/* full background track */}
        <View style={trimStyles.track} />

        {/* dimmed region BEFORE start */}
        <View style={[
          trimStyles.dimmedRegion,
          { left: TRACK_PADDING, width: startPx },
        ]} />

        {/* selected (yellow) region between handles */}
        <View style={[
          trimStyles.selectedRegion,
          { left: TRACK_PADDING + startPx, width: endPx - startPx },
        ]} />

        {/* dimmed region AFTER end */}
        <View style={[
          trimStyles.dimmedRegion,
          { left: TRACK_PADDING + endPx, width: TRACK_WIDTH - endPx },
        ]} />

        {/* playhead indicator */}
        <View style={[
          trimStyles.playhead,
          { left: TRACK_PADDING + playPx },
        ]} />

        {/* LEFT handle */}
        <View
          {...startPan.panHandlers}
          style={[trimStyles.handle, trimStyles.handleLeft, {
            left: TRACK_PADDING + startPx - HANDLE_W / 2,
          }]}>
          <View style={trimStyles.handleBar} />
          <View style={trimStyles.handleBar} />
          <View style={trimStyles.handleBar} />
        </View>

        {/* RIGHT handle */}
        <View
          {...endPan.panHandlers}
          style={[trimStyles.handle, trimStyles.handleRight, {
            left: TRACK_PADDING + endPx - HANDLE_W / 2,
          }]}>
          <View style={trimStyles.handleBar} />
          <View style={trimStyles.handleBar} />
          <View style={trimStyles.handleBar} />
        </View>

      </View>

      {/* duration label below */}
      <Text style={trimStyles.durationLabel}>
        Selected: {formatDuration(endSec - startSec)}
      </Text>

    </View>
  );
}

// ─── TrimModal — full trim UI ─────────────────────────────────────────────────

export default function TrimModal({ visible, source, duration = 0, onClose, onSaved }) {
  const videoRef   = useRef(null);
  const [startSec, setStartSec]   = useState(0);
  const [endSec, setEndSec]       = useState(duration);
  const [currentTime, setCurrentTime] = useState(0);
  const [paused, setPaused]       = useState(false);
  const [trimming, setTrimming]   = useState(false);
  const [progress, setProgress]   = useState(0);

  // when modal opens, reset to full duration
  const onModalShow = () => {
    setStartSec(0);
    setEndSec(duration);
    setCurrentTime(0);
    setPaused(false);
    setTrimming(false);
    setProgress(0);
  };

  // preview: seek to start when user moves start handle
  const handleStartChange = (val) => {
    setStartSec(val);
    videoRef.current?.seek(val);
    setCurrentTime(val);
  };

  const handleEndChange = (val) => {
    setEndSec(val);
  };

  // play only the selected region
  const onProgress = ({ currentTime: t }) => {
    setCurrentTime(t);
    if (t >= endSec) {
      setPaused(true);
      videoRef.current?.seek(startSec);
      setCurrentTime(startSec);
    }
  };

  const playPreview = () => {
    videoRef.current?.seek(startSec);
    setCurrentTime(startSec);
    setPaused(false);
  };

  // ── do the trim ──────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!source?.uri) {
      Alert.alert('Error', 'No video source provided.');
      return;
    }
    if (endSec - startSec < 1) {
      Alert.alert('Too short', 'Please select at least 1 second.');
      return;
    }

    setTrimming(true);
    setProgress(0);

    try {
      const savedPath = await trimVideo(
        source.uri,
        startSec,
        endSec,
        (pct) => setProgress(pct),
      );

      setTrimming(false);
      Alert.alert(
        '✅ Saved!',
        `Trimmed video saved to:\n${savedPath}`,
        [{ text: 'OK', onPress: () => onSaved?.(savedPath) }]
      );
    } catch (err) {
      setTrimming(false);
      Alert.alert('❌ Failed', err.message || 'Trim failed. Make sure ffmpeg-kit is installed.');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onShow={onModalShow}
      onRequestClose={onClose}>

      <View style={trimStyles.root}>

        {/* ── HEADER ── */}
        <View style={trimStyles.header}>
          <TouchableOpacity onPress={onClose} style={trimStyles.headerBtn}>
            <Text style={trimStyles.headerBtnText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={trimStyles.headerTitle}>✂️  Trim Video</Text>
          <TouchableOpacity
            onPress={handleSave}
            style={[trimStyles.headerBtn, trimStyles.saveBtn]}
            disabled={trimming}>
            <Text style={[trimStyles.headerBtnText, trimStyles.saveBtnText]}>
              {trimming ? `${progress}%` : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── VIDEO PREVIEW ── */}
        <View style={trimStyles.videoBox}>
          <Video
            ref={videoRef}
            source={source}
            style={trimStyles.video}
            paused={paused}
            resizeMode="contain"
            onProgress={onProgress}
            progressUpdateInterval={200}
          />

          {/* time overlay */}
          <View style={trimStyles.timeOverlay}>
            <Text style={trimStyles.timeOverlayText}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Text>
          </View>
        </View>

        {/* ── TRIM SLIDER ── */}
        <View style={trimStyles.sliderSection}>
          <TrimSlider
            duration={duration}
            startSec={startSec}
            endSec={endSec}
            currentTime={currentTime}
            onStartChange={handleStartChange}
            onEndChange={handleEndChange}
          />
        </View>

        {/* ── INFO ROW ── */}
        <View style={trimStyles.infoRow}>
          <InfoBox label="Start"    value={formatTime(startSec)} />
          <InfoBox label="Duration" value={formatDuration(endSec - startSec)} color="#FFE135" />
          <InfoBox label="End"      value={formatTime(endSec)} />
        </View>

        {/* ── PREVIEW BUTTON ── */}
        <TouchableOpacity
          style={trimStyles.previewBtn}
          onPress={paused ? playPreview : () => setPaused(true)}>
          <Text style={trimStyles.previewBtnText}>
            {paused ? '▶  Preview Selection' : '⏸  Pause Preview'}
          </Text>
        </TouchableOpacity>

        {/* ── PROGRESS BAR (while trimming) ── */}
        {trimming && (
          <View style={trimStyles.progressBox}>
            <ActivityIndicator color="#FFE135" style={{ marginRight: 10 }} />
            <View style={trimStyles.progressTrack}>
              <View style={[trimStyles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={trimStyles.progressText}>{progress}%</Text>
          </View>
        )}

        {/* ── INSTRUCTIONS ── */}
        <View style={trimStyles.instructions}>
          <Text style={trimStyles.instructionText}>
            Drag the <Text style={{ color: '#FFE135' }}>yellow handles</Text> to set start and end points.
            Tap Preview to watch the selection before saving.
          </Text>
        </View>

      </View>
    </Modal>
  );
}

// ─── small helper component ───────────────────────────────────────────────────

function InfoBox({ label, value, color = '#fff' }) {
  return (
    <View style={trimStyles.infoBox}>
      <Text style={trimStyles.infoLabel}>{label}</Text>
      <Text style={[trimStyles.infoValue, { color }]}>{value}</Text>
    </View>
  );
}

// ─── styles ──────────────────────────────────────────────────────────────────

const trimStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },

  // header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e1e1e',
  },
  headerBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#1e1e1e',
    minWidth: 70,
    alignItems: 'center',
  },
  saveBtn: {
    backgroundColor: '#FFE135',
  },
  headerBtnText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtnText: {
    color: '#000',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  // video
  videoBox: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  timeOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  timeOverlayText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  // slider section
  sliderSection: {
    marginTop: 28,
  },
  sliderContainer: {
    position: 'relative',
    height: 80,
  },
  timeLabel: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    width: 40,
  },
  timeLabelText: {
    color: '#FFE135',
    fontSize: 11,
    fontWeight: '700',
  },
  trackRow: {
    position: 'absolute',
    top: 28,
    left: 0,
    right: 0,
    height: 36,
  },
  track: {
    position: 'absolute',
    left: TRACK_PADDING,
    width: TRACK_WIDTH,
    height: 36,
    backgroundColor: '#1e1e1e',
    borderRadius: 4,
  },
  dimmedRegion: {
    position: 'absolute',
    top: 0,
    height: 36,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  selectedRegion: {
    position: 'absolute',
    top: 0,
    height: 36,
    backgroundColor: 'rgba(255,225,53,0.25)',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#FFE135',
  },
  playhead: {
    position: 'absolute',
    top: -4,
    width: 2,
    height: 44,
    backgroundColor: '#fff',
    borderRadius: 1,
  },
  handle: {
    position: 'absolute',
    top: 0,
    width: HANDLE_W,
    height: 36,
    backgroundColor: '#FFE135',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 3,
  },
  handleLeft:  { borderTopLeftRadius: 4,  borderBottomLeftRadius: 4 },
  handleRight: { borderTopRightRadius: 4, borderBottomRightRadius: 4 },
  handleBar: {
    width: 2,
    height: 12,
    backgroundColor: '#000',
    borderRadius: 1,
  },
  durationLabel: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
  },

  // info row
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 16,
  },
  infoBox: {
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 90,
  },
  infoLabel: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  infoValue: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },

  // preview button
  previewBtn: {
    marginTop: 24,
    marginHorizontal: 24,
    backgroundColor: '#1e1e1e',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2e2e2e',
  },
  previewBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  // progress
  progressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 24,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#1e1e1e',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    backgroundColor: '#FFE135',
    borderRadius: 2,
  },
  progressText: {
    color: '#FFE135',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 10,
    minWidth: 36,
  },

  // instructions
  instructions: {
    marginTop: 20,
    marginHorizontal: 32,
    padding: 14,
    backgroundColor: '#141414',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#222',
  },
  instructionText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
