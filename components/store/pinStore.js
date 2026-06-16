// store/pinStore.js
import * as SecureStore from "expo-secure-store";

const KEYS = {
  PIN: "hidden_videos_pin",
  EMAIL: "hidden_videos_email",
};

export async function getPin() {
  return await SecureStore.getItemAsync(KEYS.PIN);
}

export async function setPin(pin) {
  await SecureStore.setItemAsync(KEYS.PIN, pin);
}

export async function getEmail() {
  return await SecureStore.getItemAsync(KEYS.EMAIL);
}

export async function setEmail(email) {
  await SecureStore.setItemAsync(KEYS.EMAIL, email);
}

export async function clearAuth() {
  await SecureStore.deleteItemAsync(KEYS.PIN);
  await SecureStore.deleteItemAsync(KEYS.EMAIL);
}