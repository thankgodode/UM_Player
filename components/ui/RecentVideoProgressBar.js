// components/VideoProgressBar.jsx
import { StyleSheet, View } from "react-native";

export default function RecentVideoProgressBar({ position, duration }) {
  const progress = duration > 0 ? position / duration : 0;

  return (
    <View style={styles.track}>
      <View style={[styles.filled, { width: `${progress * 100}%` }]} />
      <View style={[styles.thumb, { left: `${progress * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 10,
    width:"100%",
    // backgroundColor: "red",
    position: "relative",
    justifyContent: "center",
  },
  filled: {
    height: 10,
    backgroundColor: "blue",
  },
  thumb: {
    backgroundColor: "#e3e3e3",
    position: "absolute",
    marginLeft: -6,
    top: -4,
  },
});