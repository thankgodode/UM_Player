
import { AntDesign, Entypo, Feather, MaterialCommunityIcons, MaterialIcons, Octicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import { useVideoPlayer } from 'expo-video';
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
import { MediaToolkit } from 'react-native-media-toolkit';
import Orientation from 'react-native-orientation-locker';
import { SafeAreaView } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import TrimProgressModal from "./TrimProgressModal";
import TrimVideoScreen from "./TrimVideoScreen";

import usePath from '../hooks/usePaths';

const screenWidth = 20;

// ─── helpers ────────────────────────────────────────────────────────────────

/** "125" → "2:05" */
function formatTime(seconds) {
  // if (!seconds || isNaN(seconds)) return '0:00';

  // const h = Math.floor(seconds / 3600);
  // const m = Math.floor((seconds % 3600) / 60);
  // const s = Math.floor(seconds % 60);

  // const ss = s < 10 ? `0${s}` : `${s}`;
  // const mm = h > 0 && m < 10 ? `0${m}` : `${m}`;

  // if (h > 0) return `${h}:${mm}:${ss}`;   // 1:05:09
  // return `${m}:${ss}`;                     // 4:09  (no hours shown if under 60min)
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

export default function VideoPlayer({playlist=[], startIndex=0, subtitles = [] }) {
  // refs
  const videoRef = useRef(null);
  const controlsTimer = useRef(null);
  const doubleTapTimer = useRef(null);
  const tapCount = useRef(0);
  const router = useRouter()

  // playback state
  const [paused, setPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [speed, setSpeed] = useState(1.0);

  // UI state
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [locked, setLocked] = useState(false);
  const [mirror, setMirror] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [showTrim, setShowTrim] = useState(false);

  const { paths } = usePath();

  const currentVideo = playlist[currentIndex];
  const pathSegments = currentVideo.split("/").filter(Boolean);
  const title = pathSegments[pathSegments.length - 1];

  // Video Next
  const source = { uri: currentVideo }
  // console.log("VIDEO SOURCE: ", source, currentIndex)

  const isFirst = currentIndex === 0;
  const isLast  = currentIndex === playlist.length - 1;

  // volume / brightness via swipe
  const [volume, setVolume] = useState(1.0);       // 0 – 1
  const [brightness, setBrightness] = useState(0.8); // cosmetic only (no native API needed)

  // subtitle state
  const [showSubs, setShowSubs] = useState(true);
  const [subStyleIdx, setSubStyleIdx] = useState(0);
  const [currentSub, setCurrentSub] = useState(null);

  // modals
  const [speedModal, setSpeedModal] = useState(false);
  const [subStyleModal, setSubStyleModal] = useState(false);

  // swipe indicator (volume / brightness label)
  const [swipeLabel, setSwipeLabel] = useState({});
  const swipeFade = useRef(new Animated.Value(0)).current;

  // controls fade
  const controlsOpacity = useRef(new Animated.Value(1)).current;

  // ── auto-hide controls ─────────────────────────────────────────────────────
  const resetControlsTimer = useCallback(() => {
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => {
      if (!paused && !locked) hideControls();
    }, 3500);
  }, [paused, locked,hideControls]);

  const showControlsNow = useCallback(() => {
    setShowControls(true);
    Animated.timing(controlsOpacity, {
      toValue: 1, duration: 200, useNativeDriver: true,
    }).start();
    resetControlsTimer();
  }, []);

  const hideControls = useCallback(() => {
    Animated.timing(controlsOpacity, {
      toValue: 0, duration: 400, useNativeDriver: true,
    }).start(() => setShowControls(false));
  },[controlsOpacity]);

  useEffect(() => {
    showControlsNow();
    // Orientation.lockToLandscape();
    return () => clearTimeout(controlsTimer.current);
  }, [showControlsNow]);

  useEffect(() => {
    const backAction = () => { 
      if (isFullscreen) {
        Orientation.lockToPortrait()
      } 
    }

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => backHandler.remove();
  }, [isFullscreen,router])
  
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

  // ── fullscreen ─────────────────────────────────────────────────────────────
  const toggleFullscreen = () => {
    if (isFullscreen) {
      Orientation.lockToPortrait();
      StatusBar.setHidden(false);
    } else {
      Orientation.lockToLandscape();
      StatusBar.setHidden(true);
    }
    setIsFullscreen(v => !v);
  };

  // ── swipe gestures (volume left / brightness right) ────────────────────────
  const showSwipeLabel = (text,swipeType) => {
    setSwipeLabel({label:text,type:swipeType});
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
  const swipeSide = useRef('none'); // 'left' | 'right'

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    brightnessRef.current = brightness;
  }, [brightness]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dy) > 10 && Math.abs(g.dy) > Math.abs(g.dx),
        // Math.abs(g.dy) > 10 || Math.abs(g.dx) > 10,

      onPanResponderGrant: (evt) => {
        swipeStartY.current = evt.nativeEvent.pageY;
        const x = evt.nativeEvent.pageX;
        swipeSide.current = x < SCREEN_W / 2 ? 'left' : 'right';
        swipeStartVal.current =
          swipeSide.current === 'left' ? volumeRef.current : brightnessRef.current;
      },

      onPanResponderMove: (_, g) => {
        const delta = -(g.dy / (SCREEN_H * 0.6)); // normalize
        const next = Math.min(1, Math.max(0, swipeStartVal.current + delta));
        if (swipeSide.current === 'left') {
          volumeRef.current=next
          setVolume(next);
          showSwipeLabel(`${Math.round(next * 100)}%`,"volume");
        } else {
          brightnessRef.current = next;
          setBrightness(next);
          showSwipeLabel(`${Math.round(next * 100)}%`,"brightness");
        }
      },
    })
  ).current;

  // ── double tap to seek ─────────────────────────────────────────────────────
  const handleTap = (evt) => {
    if (showControls) {
      hideControls()
      return 
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
        // left side → rewind
        videoRef.current?.seek(Math.max(0, currentTime - seekSecs));
        showSwipeLabel(`⏪ -${seekSecs}s`);
      } else {
        // right side → forward
        videoRef.current?.seek(Math.min(duration, currentTime + seekSecs));
        showSwipeLabel(`⏩ +${seekSecs}s`);
      }
    }
  };

  // video trim
  const [trimModal, setTrimModal] = useState({ visible: false, status: 'trimming', error: null });

  const applyTrim = (startMs, endMs) => {
    doOp("Trim", () =>
      MediaToolkit.trimVideo(source.uri,{startTime:startMs,endTime:endMs,outputPath: `${paths}/trimmed_${Date.now()}.mp4`})
    )
  };

  const doOp = useCallback(
    async (label, fn) => {
      setTrimModal({ visible: true, status: 'trimming', error: null });

      if (srcPlayer?.playing) srcPlayer.pause();
      if (resPlayer?.playing) resPlayer.pause();

      try {
        const r = await fn();
        console.log("TRIM RESULT: ", r)
        setTrimModal({ visible: true, status: 'success', error: null });
      } catch (e) {
        Alert.alert(label + ' failed', e?.message ?? String(e));
        setTrimModal({ visible: true, status: 'error', error: e?.message ?? String(e) });
      } finally {
        // setLoading(false);
        // setOpLabel('');
      }
    },
    [srcPlayer, resPlayer]
  );

  
  // ── video events ───────────────────────────────────────────────────────────
  const onLoad = (data) => {
    const duration = data.duration;

  // guard against 0, NaN, Infinity, or unreasonably small values
    if (!duration || isNaN(duration) || !isFinite(duration) || duration < 0.5) {
      console.warn('Invalid duration from onLoad:', duration);
      return; // wait for onProgress to give real duration
    }

    setDuration(duration);
  };

  const onProgress = (data) => {
    setCurrentTime(data.currentTime)
  };
  
  const onBuffer = ({ isBuffering }) => setLoading(isBuffering);

  // go to next video
  const goNext = () => {
    if (isLast) return;
    setCurrentIndex(i => i + 1);
    videoRef.current?.seek(0);   // reset position
    setPaused(false);            // auto-play next
    setCurrentTime(0);
  };

  // go to previous video
  const goPrev = () => {
    if (isFirst) return;
    setCurrentIndex(i => i - 1);
    videoRef.current?.seek(0);
    setPaused(false);
    setCurrentTime(0);
  };

  // auto-advance when video ends
  const onEnd = () => {
    if (!isLast) {
      goNext();          // auto-play next video
    } else {
      setPaused(true);   // stop at end of playlist
      showControlsNow();
    }
  };
  
  const onError = (e) => setError(e?.error?.errorString || 'Playback error');

  const subStyle = SUBTITLE_STYLES[subStyleIdx];

  const srcPlayer = useVideoPlayer(source.uri, (player) => {
    player.loop = true;
    // Limit ExoPlayer buffer to avoid OOM: default is 50s which exhausts 256MB heap
    player.bufferOptions = {
      preferredForwardBufferDuration: 5,
      maxBufferBytes: 30 * 1024 * 1024,
    };
  });

  const resPlayer = useVideoPlayer(source.uri ?? null, (player) => {
    player.loop = true;
    player.bufferOptions = {
      preferredForwardBufferDuration: 5,
      maxBufferBytes: 30 * 1024 * 1024,
    };
  });

  // ── render ────────────────────────────────────────────────────────────────
  if (showTrim) {
    return (
      <>
      <TrimVideoScreen
        player={srcPlayer}
        srcUri={source.uri}
        durationMs={duration*1000}
        loading={loading}
        opLabel={""}
          onBack={() => {
            setShowTrim(false)
            if (srcPlayer?.playing) srcPlayer.pause();
            if (resPlayer?.playing) resPlayer.pause();
          }}
        onApply={applyTrim}
        />
        
      {/* TRIM UI */}
      <TrimProgressModal
        visible={trimModal.visible}
        status={trimModal.status}
        errorMessage={trimModal.error}
        onDone={() => {
          setTrimModal({ visible: false, status: 'trimming', error: null });
          if (trimModal.status === 'success') setShowTrim(false); // go back to player
        }}
      />
      </>
    )
  }
  return (
    <SafeAreaView style={[styles.root, isFullscreen && styles.fullscreen]}>
      {/* ── VIDEO ── */}
      <View
        style={{flex:1}}
        {...panResponder.panHandlers}
      >
      <TouchableWithoutFeedback onPress={handleTap}>
        <View style={styles.videoWrapper}>
          <Video
            ref={videoRef}
            source={source}
            useTextureView={true}
            style={styles.video}
            paused={paused}
            rate={speed}
            volume={volume}
            resizeMode="contain"
            onLoad={onLoad}
            onProgress={onProgress}
            onBuffer={onBuffer}
            onEnd={onEnd}
            onError={onError}
            progressUpdateInterval={500}
          />
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFillObject,
              {
                backgroundColor: "black",
                opacity: Math.max(0, 0.7 - brightness)
              },
            ]}
          />
            
          {/* loading spinner */}
          {loading && (
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}

          {/* error */}
          {error && (
            <View style={styles.overlay}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          )}

          {/* swipe label (volume / brightness) */}
          <Animated.View style={[styles.swipeLabel, { opacity: swipeFade }]}>
            {swipeLabel.type ==="brightness" && <MaterialIcons name="brightness-6" size={24} color="white" />}
            {swipeLabel.type === "volume" && <Feather name="volume-2" size={24} color="white" />}
            <Text style={styles.swipeLabelText}>{swipeLabel.label}</Text>
          </Animated.View>

          {/* subtitle */}
          {showSubs && currentSub && (
            <View style={[styles.subtitleBox, { backgroundColor: subStyle.bg }]}>
              <Text style={[styles.subtitleText, { color: subStyle.color }]}>
                {currentSub}
              </Text>
            </View>
          )}

          {/* ── CONTROLS OVERLAY ── */}
          <Animated.View
            style={[styles.controls, { opacity: controlsOpacity }]}>
              {/* TOP BAR */}
              <View 
              pointerEvents={showControls ? "auto" : "none"}
              style={styles.topBar}>
                  <TouchableOpacity onPress={""}>
                    <MaterialIcons name="arrow-back" color="white" size={24} />
                  </TouchableOpacity>
                <View style={{flex:1,flexDirection:"row",alignItems:"center",width:50,overflow:"hidden"}}>
                  <Animated.View
                    style={{
                    transform: [{ translateX }],
                      
                    }}
                  >
                  <Text
                      numberOfLines={1}
                      ellipsizeMode='no'
                      style={{ color: "white" }}>{title}
                    </Text>
                  </Animated.View>
                </View>
                {/* <View style={{ flex: 1 }} /> */}
                <TouchableOpacity onPress={() => setSubStyleModal(true)} style={styles.iconBtn}>
                <MaterialCommunityIcons name="subtitles-outline"size={24} color="white"/>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={() => setShowSubs(v => !v)} style={styles.iconBtn}>
                  <Text style={styles.iconSm}>{showSubs ? 'SUB ✓' : 'SUB ✗'}</Text>
                </TouchableOpacity> */}
                <TouchableOpacity onPress={() => setSpeedModal(true)} style={styles.iconBtn}>
                  <Text style={styles.iconSm}>{speed}×</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSpeedModal(true)} style={styles.iconBtn}>
                  <Entypo name="dots-three-vertical" size={20} color="white" />
                </TouchableOpacity>
              </View>
              <View 
                pointerEvents={showControls ? "auto" : "none"}
                style={{position:"absolute",top:150,left:30}}
              >
              <TouchableOpacity onPress={() => setLocked(true)}>
                <MaterialIcons name="lock-open" color="white" size={24} />
              </TouchableOpacity>
              </View>
              {/* ACTION BUTTONS */}
              <View 
                pointerEvents={showControls ? "auto" : "none"}
                style={{width:"100%", position:"absolute", top:60,paddingLeft:15,flexDirection:"row",gap:15}}>
                <TouchableOpacity onPress={toggleFullscreen} style={styles.actionButton}>
                {/* <Text style={styles.icon}>{isFullscreen ? '⤡' : '⤢'}</Text> */}
                <MaterialIcons name={`stay-current-${isFullscreen ? "landscape" : "portrait"}`} size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton,{backgroundColor:volume?"#3c3a3a":"green"}]}
                  onPress={()=>volume?setVolume(0):setVolume(1)}
                >
                <Feather name={volume?"volume-2":"volume-x"} size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    setPaused(true)
                    
                    setShowTrim(true);
                  }}

                >
                  <MaterialCommunityIcons name="scissors-cutting" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                >
                  <MaterialIcons name="headset" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor:mirror?"green":"#3c3a3a"}]}
                  onPress={()=> setMirror(!mirror)}
                >
                  <Octicons name="mirror" size={20} color={"white"} />
                </TouchableOpacity>
              </View>
              {/* CENTER BUTTONS */}
              <View 
                pointerEvents={showControls ? "auto" : "none"}
                style={styles.centerRow}
              >
                <TouchableOpacity
                  onPress={goPrev}
                  style={styles.seekBtn}>
                  <MaterialCommunityIcons name="skip-previous" size={24} color="white" />
                  {/* <Text style={styles.seekLabel}>10</Text> */}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setPaused(v => !v)}
                  style={styles.playBtn}>
                  <AntDesign name={!paused ? "pause-circle" : "play-circle"} size={30} color="blak" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={goNext}
                  style={styles.seekBtn}>
                  <MaterialCommunityIcons name="skip-next" size={24} color="white" />
                  {/* <Text style={styles.seekLabel}>10</Text> */}
                </TouchableOpacity>
              </View>
              {/* BOTTOM BAR */}
              <View 
                pointerEvents={showControls ? "auto" : "none"}
                style={styles.bottomBar}
              >
                <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={duration || 1}
                  value={currentTime}
                  minimumTrackTintColor="red"
                  maximumTrackTintColor="rgba(255,255,255,0.3)"
                  thumbTintColor="#FFFFFF"
                  onSlidingComplete={(val) => {
                    videoRef.current?.seek(val);
                    resetControlsTimer();
                  }}
                />

                <Text style={styles.timeText}>{formatTime(duration)}</Text>
              </View>
          </Animated.View>
          {/* LOCK SCREEN */}
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
      {/* ── SPEED MODAL ── */}
      <Modal transparent visible={speedModal} animationType="fade"
        onRequestClose={() => setSpeedModal(false)}>
        <TouchableWithoutFeedback onPress={() => setSpeedModal(false)}>
          <View style={styles.modalBg}>
            <TouchableWithoutFeedback>
              <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>Playback Speed</Text>
                {SPEEDS.map(s => (
                  <TouchableOpacity key={s} style={styles.modalRow}
                    onPress={() => { setSpeed(s); setSpeedModal(false); }}>
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

      {/* ── SUBTITLE STYLE MODAL ── */}
      <Modal transparent visible={subStyleModal} animationType="fade"
        onRequestClose={() => setSubStyleModal(false)}>
        <TouchableWithoutFeedback onPress={() => setSubStyleModal(false)}>
          <View style={styles.modalBg}>
            <TouchableWithoutFeedback>
              <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>Subtitle Style</Text>
                {SUBTITLE_STYLES.map((st, i) => (
                  <TouchableOpacity key={i} style={styles.modalRow}
                    onPress={() => { setSubStyleIdx(i); setSubStyleModal(false); }}>
                    <Text style={[styles.modalItem, { color: st.color },
                      subStyleIdx === i && styles.modalItemActive]}>
                      {st.label}  {subStyleIdx === i ? '✓' : ''}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal >      
    </SafeAreaView>
  );
}

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
