import { AntDesign, Entypo, Feather, MaterialCommunityIcons, MaterialIcons, Octicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useEvent } from 'expo';
import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  BackHandler,
  Dimensions,
  Modal,
  PanResponder,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import * as ScreenOrientation from "expo-screen-orientation";


import { MediaToolkit } from 'react-native-media-toolkit';
import { SafeAreaView } from 'react-native-safe-area-context';
import TrimProgressModal from "./TrimProgressModal";
import TrimVideoScreen from "./TrimVideoScreen";

import usePath from '../hooks/usePaths';
import useVideoStore from '../store/videoStore';
import { addRecentVideo } from '../utils/recentVideo';
import SubtitleModal from './SubtitleModal';

const screenWidth = 20;

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '00:00:00';
  const duration = new Date(seconds * 1000).toISOString().substring(11, 19);
  return duration;
}

const SPEEDS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

const SUBTITLE_STYLES = [
  { label: 'White', color: '#ffffff', bg: 'rgba(0,0,0,0.6)' },
  { label: 'Yellow', color: '#FFE500', bg: 'rgba(0,0,0,0.6)' },
  { label: 'Green', color: '#00FF87', bg: 'rgba(0,0,0,0.6)' },
  { label: 'None (no bg)', color: '#ffffff', bg: 'transparent' },
];

// ─── component ──────────────────────────────────────────────────────────────

export default function VideoPlayer({ playlist = [], startIndex = 0, resumePlaying = 0 }) {
  const controlsTimer = useRef(null);
  const doubleTapTimer = useRef(null);
  const ref = useRef(null);

  const tapCount = useRef(0);
  const router = useRouter();

  // UI state
  const [isInPiP, setIsInPiP] = useState(false);
  const [allowPiP, setAllowPiP] = useState(true);
  const [autoEnterPiP, setAutoEnterPiP] = useState(true);

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [speed, setSpeed] = useState(1.0);

  const [subtitles, setSubtitles] = useState([]); // 👈 now dynamic, not just a prop
  const [showSubtitleModal, setShowSubtitleModal] = useState(false);
  const [subtitleFilename, setSubtitleFilename] = useState(null);
  const [showControls, setShowControls] = useState(true);
  const [locked, setLocked] = useState(false);
  const [mirror, setMirror] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [showTrim, setShowTrim] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(true)

  const { paths } = usePath();

  const currentVideo = playlist[currentIndex]?.uri || playlist[currentIndex]?.hiddenUri || playlist;
  const pathSegments = currentVideo.split("/").filter(Boolean);
  const title = pathSegments[pathSegments.length - 1];

  const source = { uri: currentVideo };

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === playlist.length - 1;

  const [volume, setVolume] = useState(1.0);
  const [brightness, setBrightness] = useState(0.8);

  const [showSubs, setShowSubs] = useState(true);
  const [subStyleIdx, setSubStyleIdx] = useState(0);
  const [currentSub, setCurrentSub] = useState(null);

  const [speedModal, setSpeedModal] = useState(false);
  const [subStyleModal, setSubStyleModal] = useState(false);

  const [swipeLabel, setSwipeLabel] = useState({});
  const swipeFade = useRef(new Animated.Value(0)).current;

  const navigation = useRouter();

  const togglePiP = useCallback(() => {
    if (!isInPiP) {
      ref.current?.startPictureInPicture();
    } else {
      ref.current?.stopPictureInPicture();
    }
  }, []);

  const isPrivate = useVideoStore((s) =>
    s.privateVideos.some((v) => v.hiddenUri === currentVideo)
  );

  const controlsOpacity = useRef(new Animated.Value(1)).current;

  // ── expo-video player ─────────────────────────────────────────────────────
  const player = useVideoPlayer({
    uri: source.uri,
  }, (p) => {
    // p.showNowPlayingNotification = true
    p.staysActiveInBackground = false
    p.loop = false;
    p.timeUpdateEventInterval = 0.5; // ~ same as progressUpdateInterval={500}
    p.play();
  });

  // secondary player used only for previewing a trimmed result
  const resPlayer = useVideoPlayer(null, (p) => {
    p.loop = true;
  });

  // ── event hooks ────────────────────────────────────────────────────────────
  const { status, error: statusError } = useEvent(player, 'statusChange', {
    status: player.status,
    error: undefined,
  });

  const { isPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  });

  const { currentTime: liveTime } = useEvent(player, 'timeUpdate', {
    currentTime: player.currentTime,
  });

  // sync status → loading / error / duration
const hasResumedRef = useRef(false);

// reset the guard whenever the video source changes
  useEffect(() => {
    hasResumedRef.current = false;
  }, [currentIndex]);

  useEffect(() => {
    // Allow the screen to rotate freely while on the player screen
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);


    return () => {
      // Lock back to portrait when leaving the player screen
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };
  }, []);

  useEffect(() => {
    setLoading(status === 'loading');

    if (status === 'error') {
      setError(statusError?.message || 'Playback error');
    }

    if (status === 'readyToPlay') {
      const d = player.duration;
      if (d && !isNaN(d) && isFinite(d) && d >= 0.5) {
        setDuration(d);

        // 👇 only seek to resumePlaying the FIRST time this video becomes ready
        if (resumePlaying > 0 && !hasResumedRef.current) {
          player.currentTime = resumePlaying;
          hasResumedRef.current = true;
        }
      }
    }
  }, [status]);
  // sync currentTime from timeUpdate events
  useEffect(() => {
    if (liveTime != null) setCurrentTime(liveTime);
  }, [liveTime]);

  // apply speed changes
  useEffect(() => {
    player.playbackRate = speed;
  }, [speed]);

  // apply volume changes
  useEffect(() => {
    player.volume = volume;
  }, [volume]);

  // handle end of video
  useEffect(() => {
    const sub = player.addListener('playToEnd', () => {
      onEnd();
    });
    return () => sub.remove();
  }, [player, isLast]);

  const paused = !isPlaying;

  const seekTo = useCallback((time) => {
    const clamped = Math.max(0, Math.min(duration || time, time));
    player.currentTime = clamped;
  }, [player, duration]);

  // ── auto-hide controls ─────────────────────────────────────────────────────
  const hideControls = useCallback(() => {
    Animated.timing(controlsOpacity, {
      toValue: 0, duration: 400, useNativeDriver: true,
    }).start(() => setShowControls(false));
  }, [controlsOpacity]);

  const resetControlsTimer = useCallback(() => {
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => {
      if (!paused && !locked) hideControls();
    }, 3500);
  }, [paused, locked, hideControls]);

  const showControlsNow = useCallback(() => {
    setShowControls(true);
    Animated.timing(controlsOpacity, {
      toValue: 1, duration: 200, useNativeDriver: true,
    }).start();
    resetControlsTimer();
  }, []);

  useEffect(() => {
    const backAction = () => {
      const videoInfo = {
        uri: source.uri,
        duration: duration,
        currentTime: currentTime,
        filename: title,
        date: Date.now()
      };

      if (isPrivate) {
        navigation.back();
        return true;
      }

      addRecentVideo(videoInfo);
      navigation.back();
      return true;
    };

    const handler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => handler.remove();
  }, [duration, currentTime, title, navigation, isPrivate, source.uri]);

  useEffect(() => {
    showControlsNow();
    return () => clearTimeout(controlsTimer.current);
  }, [showControlsNow]);

  // ── subtitles ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const sub = subtitles.find(
      s => currentTime >= s.start && currentTime <= s.end
    );
    setCurrentSub(sub ? sub.text : null);
  }, [currentTime, subtitles]);

  const translateX = useRef(new Animated.Value(screenWidth)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: -200,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();
  }, [translateX]);

  async function toggleOrientation() {
    await ScreenOrientation.lockAsync(isFullScreen ? ScreenOrientation.OrientationLock.PORTRAIT_UP : ScreenOrientation.OrientationLock.LANDSCAPE);
    setIsFullScreen(!isFullScreen)
  }

  // ── swipe gestures (volume left / brightness right) ────────────────────────
  const showSwipeLabel = (text, swipeType) => {
    setSwipeLabel({ label: text, type: swipeType });
    swipeFade.setValue(1);
    Animated.timing(swipeFade, {
      toValue: 0, duration: 1200, delay: 600, useNativeDriver: true,
    }).start();
  };

  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
  const swipeStartY = useRef(0);
  const swipeStartVal = useRef(0);
  const volumeRef = useRef(volume);
  const brightnessRef = useRef(brightness);
  const swipeSide = useRef('none');

  useEffect(() => { volumeRef.current = volume; }, [volume]);
  useEffect(() => { brightnessRef.current = brightness; }, [brightness]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dy) > 10 && Math.abs(g.dy) > Math.abs(g.dx),

      onPanResponderGrant: (evt) => {
        swipeStartY.current = evt.nativeEvent.pageY;
        const x = evt.nativeEvent.pageX;
        swipeSide.current = x < SCREEN_W / 2 ? 'left' : 'right';
        swipeStartVal.current =
          swipeSide.current === 'left' ? volumeRef.current : brightnessRef.current;
      },

      onPanResponderMove: (_, g) => {
        const delta = -(g.dy / (SCREEN_H * 0.6));
        const next = Math.min(1, Math.max(0, swipeStartVal.current + delta));
        if (swipeSide.current === 'left') {
          volumeRef.current = next;
          setVolume(next);
          showSwipeLabel(`${Math.round(next * 100)}%`, "volume");
        } else {
          brightnessRef.current = next;
          setBrightness(next);
          showSwipeLabel(`${Math.round(next * 100)}%`, "brightness");
        }
      },
    })
  ).current;

  // ── double tap to seek ─────────────────────────────────────────────────────
  const handleTap = (evt) => {
    if (showControls) {
      hideControls();
      return;
    }
    if (locked) return;
    tapCount.current += 1;

    if (tapCount.current === 1) {
      doubleTapTimer.current = setTimeout(() => {
        tapCount.current = 0;
        showControlsNow();
      }, 300);
    } else if (tapCount.current === 2) {
      clearTimeout(doubleTapTimer.current);
      tapCount.current = 0;
      const x = evt.nativeEvent.pageX;
      const seekSecs = 10;
      if (x < SCREEN_W / 2) {
        seekTo(Math.max(0, currentTime - seekSecs));
        showSwipeLabel(`⏪ -${seekSecs}s`);
      } else {
        seekTo(Math.min(duration, currentTime + seekSecs));
        showSwipeLabel(`⏩ +${seekSecs}s`);
      }
    }
  };

  // ── video trim ───────────────────────────────────────────────────────────
  const [trimModal, setTrimModal] = useState({ visible: false, status: 'trimming', error: null });

  const applyTrim = (startMs, endMs) => {
    doOp("Trim", () =>
      MediaToolkit.trimVideo(source.uri, { startTime: startMs, endTime: endMs, outputPath: `${paths}/trimmed_${Date.now()}.mp4` })
    );
  };

  const doOp = useCallback(
    async (label, fn) => {
      setTrimModal({ visible: true, status: 'trimming', error: null });

      if (player.playing) player.pause();
      if (resPlayer.playing) resPlayer.pause();

      try {
        const r = await fn();
        console.log("TRIM RESULT: ", r);
        setTrimModal({ visible: true, status: 'success', error: null });
      } catch (e) {
        Alert.alert(label + ' failed', e?.message ?? String(e));
        setTrimModal({ visible: true, status: 'error', error: e?.message ?? String(e) });
      }
    },
    [player, resPlayer]
  );

  // go to next video
  const goNext = () => {
    if (isLast) return;
    setCurrentIndex(i => i + 1);
    setCurrentTime(0);
  };

  // go to previous video
  const goPrev = () => {
    if (isFirst) return;
    setCurrentIndex(i => i - 1);
    setCurrentTime(0);
  };

  // reload source whenever currentIndex changes (playlist navigation)
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      // First video load — don't touch currentTime, let the `status` effect handle resumePlaying
      isInitialMount.current = false;
      player.play();
      return;
    }

    // Subsequent index changes (goNext / goPrev) — reset normally
    player.replaceAsync(source.uri).then(() => {
      player.currentTime = 0;
      player.play();
    }).catch((e) => console.log("replace error", e));
  }, [currentIndex]);

  const onEnd = () => {
    if (!isLast) {
      goNext();
    } else {
      player.pause();
      showControlsNow();
    }
  };

  const subStyle = SUBTITLE_STYLES[subStyleIdx];

  // ── render ────────────────────────────────────────────────────────────────
  if (showTrim) {
    return (
      <>
        <TrimVideoScreen
          player={player}
          srcUri={source.uri}
          durationMs={duration * 1000}
          loading={loading}
          opLabel={""}
          onBack={() => {
            setShowTrim(false);
            if (player.playing) player.pause();
            if (resPlayer.playing) resPlayer.pause();
          }}
          onApply={applyTrim}
        />
        <TrimProgressModal
          visible={trimModal.visible}
          status={trimModal.status}
          errorMessage={trimModal.error}
          onDone={() => {
            setTrimModal({ visible: false, status: 'trimming', error: null });
            if (trimModal.status === 'success') setShowTrim(false);
          }}
        />
      </>
    );
  }

  return (
    <SafeAreaView style={[styles.root, isFullScreen && styles.fullscreen]}>
      <View style={{ flex: 1 }} {...panResponder.panHandlers}>
        <TouchableWithoutFeedback onPress={handleTap}>
          <View style={styles.videoWrapper}>
          <VideoView
            ref={ref}
            style={{flex:1}}
            player={player}
            testID={"pip-video-view"}
            nativeControls={false}
            onPictureInPictureStart={() => setIsInPiP(true)}
            onPictureInPictureStop={() => setIsInPiP(true)}
            onFullscreenEnter={() => {
              ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
            }}
            onFullscreenExit={() => {
              ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            }}
            allowsPictureInPicture={allowPiP}
            startsPictureInPictureAutomatically={autoEnterPiP}
          />
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFillObject,
              { backgroundColor: "black", opacity: Math.max(0, 0.7 - brightness) },
            ]}
          />

            {loading && (
              <View style={styles.overlay}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}

            {error && (
              <View style={styles.overlay}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            )}

            <Animated.View style={[styles.swipeLabel, { opacity: swipeFade }]}>
              {swipeLabel.type === "brightness" && <MaterialIcons name="brightness-6" size={24} color="white" />}
              {swipeLabel.type === "volume" && <Feather name="volume-2" size={24} color="white" />}
              <Text style={styles.swipeLabelText}>{swipeLabel.label}</Text>
            </Animated.View>

            {showSubs && currentSub && (
              <View style={[styles.subtitleBox, { backgroundColor: subStyle.bg }]}>
                <Text style={[styles.subtitleText, { color: subStyle.color }]}>
                  {currentSub}
                </Text>
              </View>
            )}

            <Animated.View style={[styles.controls, { opacity: controlsOpacity }]}>
              <View pointerEvents={showControls ? "auto" : "none"} style={styles.topBar}>
                <TouchableOpacity onPress={""}>
                  <MaterialIcons name="arrow-back" color="white" size={24} />
                </TouchableOpacity>
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", width: 50, overflow: "hidden" }}>
                  <Animated.View style={{ transform: [{ translateX }] }}>
                    <Text numberOfLines={1} ellipsizeMode='no' style={{ color: "white" }}>{title}</Text>
                  </Animated.View>
                </View>
                <TouchableOpacity onPress={() => setShowSubtitleModal(true)} style={styles.iconBtn}>
                  <MaterialCommunityIcons name="subtitles-outline" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSpeedModal(true)} style={styles.iconBtn}>
                  <Text style={styles.iconSm}>{speed}×</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSpeedModal(true)} style={styles.iconBtn}>
                  <Entypo name="dots-three-vertical" size={20} color="white" />
                </TouchableOpacity>
              </View>

              <View pointerEvents={showControls ? "auto" : "none"} style={{ position: "absolute", top: 150, left: 30 }}>
                <TouchableOpacity onPress={() => setLocked(true)}>
                  <MaterialIcons name="lock-open" color="white" size={24} />
                </TouchableOpacity>
              </View>

              <View pointerEvents={showControls ? "auto" : "none"} style={{ width: "100%", position: "absolute", top: 60, paddingLeft: 15, flexDirection: "row", gap: 15 }}>
                <TouchableOpacity onPress={toggleOrientation} style={[styles.actionButton, { backgroundColor: "#3c3a3a" }]}>
                  <MaterialIcons name={`stay-current-${isFullScreen ? "landscape" : "portrait"}`} size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: volume ? "#3c3a3a" : "rgb(97, 149, 177)" }]}
                  onPress={() => volume ? setVolume(0) : setVolume(1)}
                >
                  <Feather name={volume ? "volume-2" : "volume-x"} size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    player.pause();
                    setShowTrim(true);
                  }}
                >
                  <MaterialCommunityIcons name="scissors-cutting" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={togglePiP}>
                  <Entypo name="popup" size={20} color="white" />
                </TouchableOpacity>
              </View>

              <View pointerEvents={showControls ? "auto" : "none"} style={styles.centerRow}>
                <TouchableOpacity onPress={goPrev} style={styles.seekBtn}>
                  <MaterialCommunityIcons name="skip-previous" size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => paused ? player.play() : player.pause()}
                  style={styles.playBtn}>
                  <AntDesign name={!paused ? "pause-circle" : "play-circle"} size={30} color="blak" />
                </TouchableOpacity>

                <TouchableOpacity onPress={goNext} style={styles.seekBtn}>
                  <MaterialCommunityIcons name="skip-next" size={24} color="white" />
                </TouchableOpacity>
              </View>

              <View pointerEvents={showControls ? "auto" : "none"} style={styles.bottomBar}>
                <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={duration || 1}
                  value={currentTime}
                  minimumTrackTintColor="rgb(97, 149, 177)"
                  maximumTrackTintColor="rgba(255,255,255,0.3)"
                  thumbTintColor="#FFFFFF"
                  onSlidingComplete={(val) => {
                    seekTo(val);
                    resetControlsTimer();
                  }}
                />
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
              </View>
            </Animated.View>

            {locked && (
              <View style={styles.lockOverlay}>
                <TouchableOpacity onPress={() => setLocked(false)} style={styles.unlockBtn}>
                  <MaterialIcons name="lock" color="white" size={24} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>

      <SubtitleModal
        visible={showSubtitleModal}
        onClose={() => setShowSubtitleModal(false)}
        videoTitle={title.replace(/\.[^/.]+$/, "")} // strip file extension for better search results
        onSubtitleLoaded={({ subtitles: parsed, filename }) => {
          setSubtitles(parsed);
          setSubtitleFilename(filename);
          setShowSubs(true);
        }}
      />
      <Modal transparent visible={speedModal} animationType="fade" onRequestClose={() => setSpeedModal(false)}>
        <TouchableWithoutFeedback onPress={() => setSpeedModal(false)}>
          <View style={styles.modalBg}>
            <TouchableWithoutFeedback>
              <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>Playback Speed</Text>
                {SPEEDS.map(s => (
                  <TouchableOpacity key={s} style={styles.modalRow} onPress={() => { setSpeed(s); setSpeedModal(false); }}>
                    <Text style={[styles.modalItem, speed === s && styles.modalItemActive]}>
                      {s === 1.0 ? 'Normal' : `${s}×`}  {speed === s ? '✓' : ''}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal transparent visible={subStyleModal} animationType="fade" onRequestClose={() => setSubStyleModal(false)}>
        <TouchableWithoutFeedback onPress={() => setSubStyleModal(false)}>
          <View style={styles.modalBg}>
            <TouchableWithoutFeedback>
              <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>Subtitle Style</Text>
                {SUBTITLE_STYLES.map((st, i) => (
                  <TouchableOpacity key={i} style={styles.modalRow} onPress={() => { setSubStyleIdx(i); setSubStyleModal(false); }}>
                    <Text style={[styles.modalItem, { color: st.color }, subStyleIdx === i && styles.modalItemActive]}>
                      {st.label}  {subStyleIdx === i ? '✓' : ''}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

// styles unchanged — reuse your existing styles object

// ─── styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#000',
    flex:1
    // paddingTop: StatusBar.currentHeight || 0,
  },
  fullscreen: {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%',
    height: '100%',
    zIndex: 999,
    aspectRatio: undefined,
  },
  videoWrapper: {
    flex: 1,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },

  // overlay for loading / error
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  errorText: {
    color: '#ff5f5f',
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  // swipe label
  swipeLabel: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: "row",
    gap:5
  },
  swipeLabelText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // subtitles
  subtitleBox: {
    position: 'absolute',
    bottom: 54,
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    maxWidth: '80%',
  },
  subtitleText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },

  // controls
  controls: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },

  // action buttons
  actionButton:
  {
    padding: 10,
    backgroundColor:
      "#3c3a3a",
    borderRadius: 30
  },

  // top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  iconBtn: {
    padding: 8,
  },
  icon: {
    fontSize: 18,
    color: '#fff',
  },
  iconSm: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // center
  centerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 28,
  },
  playBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 24,
    color: '#fff',
  },
  seekBtn: {
    alignItems: 'center',
  },
  seekIcon: {
    fontSize: 26,
    color: '#fff',
  },
  seekLabel: {
    color: '#fff',
    fontSize: 10,
    marginTop: -4,
  },

  // bottom bar
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 8,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    minWidth: 38,
    textAlign: 'center',
  },
  slider: {
    flex: 1,
    height: 36,
  },

  // lock
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unlockBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },

  // modals
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    minWidth: 220,
  },
  modalTitle: {
    color: '#aaa',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  modalRow: {
    paddingVertical: 10,
  },
  modalItem: {
    color: '#fff',
    fontSize: 16,
  },
  modalItemActive: {
    fontWeight: '700',
  },
});
