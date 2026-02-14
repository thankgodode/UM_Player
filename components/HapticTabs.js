import * as Haptics from 'expo-haptics';
import { TouchableOpacity } from 'react-native';

export function HapticTab(props) {
  return (
    <TouchableOpacity
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}
