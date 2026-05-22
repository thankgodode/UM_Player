/**
 * TrimModal.js — using react-native-video-trim
 *
 * TWO WAYS TO USE:
 *  1. showEditor()  → opens the library's built-in native trim UI
 *  2. trim()        → headless, trimming silently in background
 *
 * We use showEditor() — it gives you the native slider UI for free,
 * handles preview, and saves automatically. No custom slider needed.
 */

import { useEffect } from 'react';
import { Alert, NativeEventEmitter, NativeModules } from 'react-native';
import {
  isValidFile,
  showEditor, // opens native trim UI
  trim
} from 'react-native-video-trim';




export default function useTrim({ onSaved }) {
  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.VideoTrim);
    
    const subscription = eventEmitter.addListener('VideoTrim', (event) => {
      switch (event.name) {
        case 'onFinishTrimming':
          console.log('Video trimmed:', event.outputPath);
          break;
        case 'onError':
          console.error('Trimming failed:', event.message);
          break;
        // Handle other events...
      }
    });

    return () => subscription.remove();
  }, []);

  // useEffect(() => {
  //   // listen for trim events from the native editor
  //   const subscription = addListener('VideoTrim', (event) => {

  //     switch (event.name) {

  //       case 'onFinishTrimming':
  //         // user hit Save — outputPath is where the file was saved
  //         console.log('Trimmed file saved to:', event.outputPath);
  //         onSaved?.(event.outputPath);
  //         break;

  //       case 'onCancelTrimming':
  //         // user hit Cancel — do nothing
  //         console.log('Trim cancelled');
  //         break;

  //       case 'onError':
  //         Alert.alert('Trim Error', event.message || 'Something went wrong');
  //         break;

  //       case 'onLog':
  //         // ffmpeg progress logs — optional
  //         console.log('[VideoTrim log]', event.message);
  //         break;
  //     }
  //   });

  //   return () => {
  //     removeListener(subscription);  // cleanup on unmount
  //   };
  // }, [onSaved]);

  /**
   * openTrimEditor(videoUri)
   * Call this to open the native trim UI for a video
   */
  const openTrimEditor = async (videoUri) => {
    const valid = await isValidFile(videoUri);
    if (!valid) {
      Alert.alert('Invalid file', 'This video cannot be trimmed.');
      return;
    }

    console.log("Path: ", videoUri)
    showEditor(videoUri, {
      // maxDuration: 6000,          // max trim length in seconds (optional)
      // removeAudio: false,
      saveToPhoto:true, 
      outputExt: 'mp4',         // output format
    });
  };

  /**
   * trimSilently(videoUri, startMs, endMs)
   * Trim without showing any UI — useful for automated trimming
   * startMs and endMs are in MILLISECONDS
   */
  const trimSilently = async (videoUri, startMs, endMs) => {
    const valid = await isValidFile(videoUri);
    if (!valid) {
      Alert.alert('Invalid file', 'This video cannot be trimmed.');
      return;
    }

    try {
      const result = await trim(videoUri, {
        startTime: startMs,       // milliseconds
        endTime: endMs,           // milliseconds
        removeAudio: false,
      });
      console.log('Silent trim saved to:', result.outputPath);
      onSaved?.(result.outputPath);
    } catch (err) {
      Alert.alert('Trim failed', err.message);
    }
  };

  return { openTrimEditor, trimSilently };
}