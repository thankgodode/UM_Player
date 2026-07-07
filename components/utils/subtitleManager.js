// utils/subtitleManager.js
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import { parseSubtitleFile } from "./subtitleParser";

// ── Pick a subtitle file from device storage ──────────────
export async function pickSubtitleFile() {
  const result = await DocumentPicker.getDocumentAsync({
    type: ["*/*"], // srt/vtt don't have a reliable universal mime type
    copyToCacheDirectory: true,
  });

  if (result.canceled) return null;

  const file = result.assets[0];
  const ext = file.name.split(".").pop().toLowerCase();

  if (!["srt", "vtt"].includes(ext)) {
    throw new Error("Please select a .srt or .vtt subtitle file");
  }

  const content = await FileSystem.readAsStringAsync(file.uri);
  console.log("PARSE FILE: ", content, file.name);
  return {
    subtitles: parseSubtitleFile(content, file.name),
    filename: file.name,
    source: "local",
  };
}

// ── Search subtitles online via OpenSubtitles REST API ────
// Requires a free API key from https://www.opensubtitles.com/en/consumers
const OPENSUBTITLES_API_KEY = "YOUR_API_KEY_HERE";
const OPENSUBTITLES_BASE = "https://api.opensubtitles.com/api/v1";

export async function searchOnlineSubtitles(query, language = "en") {
  const res = await fetch(
    `${OPENSUBTITLES_BASE}/subtitles?query=${encodeURIComponent(query)}&languages=${language}`,
    {
      headers: {
        "Api-Key": OPENSUBTITLES_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) throw new Error("Failed to search subtitles");

  const data = await res.json();

  return data.data.map((item) => ({
    id: item.id,
    title: item.attributes.release,
    language: item.attributes.language,
    downloadCount: item.attributes.download_count,
    fileId: item.attributes.files?.[0]?.file_id,
  }));
}

export async function downloadOnlineSubtitle(fileId) {
  // Step 1 — request a download link
  const linkRes = await fetch(`${OPENSUBTITLES_BASE}/download`, {
    method: "POST",
    headers: {
      "Api-Key": OPENSUBTITLES_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ file_id: fileId }),
  });

  if (!linkRes.ok) throw new Error("Failed to get subtitle download link");

  const linkData = await linkRes.json();

  // Step 2 — fetch the actual subtitle file content
  const fileRes = await fetch(linkData.link);
  const content = await fileRes.text();

  return {
    subtitles: parseSubtitleFile(content, linkData.file_name || "subtitle.srt"),
    filename: linkData.file_name || "subtitle.srt",
    source: "online",
  };
}