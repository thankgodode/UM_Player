import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Easing,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type Status = 'trimming' | 'success' | 'error';

interface Props {
  visible: boolean;
  status: Status;
  errorMessage?: string;
  onDone: () => void; // called when user taps Done / OK
}

// ── Spinning ring ────────────────────────────────────────────────────────────
const SpinnerRing = () => {
  const rot = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rot, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = rot.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View style={[styles.ring, { transform: [{ rotate }] }]} />
  );
};

// ── Animated checkmark (draws itself in) ─────────────────────────────────────
const Checkmark = () => {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 120,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.checkCircle, { transform: [{ scale }], opacity }]}>
      <Text style={styles.checkIcon}>✓</Text>
    </Animated.View>
  );
};

// ── Error X ───────────────────────────────────────────────────────────────────
const ErrorMark = () => {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      tension: 120,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.errorCircle, { transform: [{ scale }] }]}>
      <Text style={styles.checkIcon}>✕</Text>
    </Animated.View>
  );
};

// ── Pulsing dots ──────────────────────────────────────────────────────────────
const PulsingDots = () => {
    const dot0 = useRef(new Animated.Value(0.3)).current;
    const dot1 = useRef(new Animated.Value(0.3)).current;
    const dot2 = useRef(new Animated.Value(0.3)).current;

    const dots = [dot0, dot1, dot2];

  useEffect(() => {
    const anims = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 180),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      )
    );
    anims.forEach(a => a.start());
    return () => anims.forEach(a => a.stop());
  }, []);

  return (
    <View style={styles.dotsRow}>
      {dots.map((dot, i) => (
        <Animated.View key={i} style={[styles.dot, { opacity: dot }]} />
      ))}
    </View>
  );
};

// ── Main modal ────────────────────────────────────────────────────────────────
export default function TrimProgressModal({ visible, status, errorMessage, onDone }: Props) {
  const cardScale = useRef(new Animated.Value(0.85)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(cardScale, {
          toValue: 1,
          friction: 7,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      cardScale.setValue(0.85);
      cardOpacity.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {}} // prevent back-button dismiss while trimming
    >
      <View style={styles.backdrop}>
        <Animated.View
          style={[
            styles.card,
            { transform: [{ scale: cardScale }], opacity: cardOpacity },
          ]}
        >
          {/* ── Icon area ── */}
          <View style={styles.iconArea}>
            {status === 'trimming' && (
              <>
                <SpinnerRing />
                <View style={styles.scissors}>
                  <Text style={styles.scissorsIcon}>✂</Text>
                </View>
              </>
            )}
            {status === 'success' && <Checkmark />}
            {status === 'error'   && <ErrorMark />}
          </View>

          {/* ── Text ── */}
          {status === 'trimming' && (
            <>
              <Text style={styles.title}>Trimming Video</Text>
              <Text style={styles.subtitle}>Please wait while we cut your clip</Text>
              <PulsingDots />
            </>
          )}

          {status === 'success' && (
            <>
              <Text style={styles.title}>Trim Complete</Text>
              <Text style={styles.subtitle}>Your video has been saved successfully.</Text>
              <TouchableOpacity style={styles.doneBtn} onPress={onDone} activeOpacity={0.8}>
                <Text style={styles.doneTxt}>Done</Text>
              </TouchableOpacity>
            </>
          )}

          {status === 'error' && (
            <>
              <Text style={styles.title}>Trim Failed</Text>
              <Text style={[styles.subtitle, styles.errorTxt]}>
                {errorMessage ?? 'Something went wrong. Please try again.'}
              </Text>
              <TouchableOpacity style={[styles.doneBtn, styles.errorBtn]} onPress={onDone} activeOpacity={0.8}>
                <Text style={styles.doneTxt}>OK</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const ACCENT  = '#FFFFFF';
const SUCCESS = '#34C759';
const ERROR   = '#FF453A';

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 260,
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  // ── icon area ──
  iconArea: {
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  // spinner ring
  ring: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: ACCENT,
    borderRightColor: 'rgba(255,255,255,0.25)',
  },

  // scissors inside spinner
  scissors: {
    position: 'absolute',
  },
  scissorsIcon: {
    fontSize: 28,
    color: '#FFF',
  },

  // checkmark
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: SUCCESS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    fontSize: 30,
    color: '#FFF',
    fontWeight: '700',
  },

  // error
  errorCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: ERROR,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── text ──
  title: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 4,
  },
  errorTxt: {
    color: 'rgba(255,80,70,0.85)',
  },

  // ── pulsing dots ──
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },

  // ── done button ──
  doneBtn: {
    marginTop: 20,
    backgroundColor: ACCENT,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  errorBtn: {
    backgroundColor: ERROR,
  },
  doneTxt: {
    color: '#000',
    fontWeight: '700',
    fontSize: 15,
  },
});