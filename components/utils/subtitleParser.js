// utils/subtitleParser.js

// Converts "00:01:23,456" or "00:01:23.456" → seconds
function timeToSeconds(timeStr) {
  const normalized = timeStr.replace(",", ".");
  const [h, m, s] = normalized.split(":");
  return parseInt(h) * 3600 + parseInt(m) * 60 + parseFloat(s);
}

export function parseSRT(content) {
  const blocks = content.trim().split(/\r?\n\r?\n/);
  const subtitles = [];

  for (const block of blocks) {
    const lines = block.split(/\r?\n/);
    if (lines.length < 2) continue;

    // line[0] is index, line[1] is timing, rest is text
    const timingLine = lines.find((l) => l.includes("-->"));
    if (!timingLine) continue;

    const [startStr, endStr] = timingLine.split("-->").map((s) => s.trim());
    const textStartIndex = lines.indexOf(timingLine) + 1;
    const text = lines.slice(textStartIndex).join("\n").trim();

    subtitles.push({
      start: timeToSeconds(startStr),
      end: timeToSeconds(endStr),
      text,
    });
  }

  return subtitles;
}

export function parseVTT(content) {
  // strip WEBVTT header and any NOTE blocks
  const cleaned = content.replace(/^WEBVTT.*\n/, "").trim();
  const blocks = cleaned.split(/\r?\n\r?\n/);
  const subtitles = [];

  for (const block of blocks) {
    const lines = block.split(/\r?\n/);
    const timingLine = lines.find((l) => l.includes("-->"));
    if (!timingLine) continue;

    const [startStr, endStr] = timingLine.split("-->").map((s) => s.trim().split(" ")[0]);
    const textStartIndex = lines.indexOf(timingLine) + 1;
    const text = lines.slice(textStartIndex).join("\n").trim();

    subtitles.push({
      start: timeToSeconds(startStr),
      end: timeToSeconds(endStr),
      text,
    });
  }

  return subtitles;
}

export function parseSubtitleFile(content, filename) {
  const ext = filename.split(".").pop().toLowerCase();
  if (ext === "vtt") return parseVTT(content);
  return parseSRT(content); // default to SRT parsing
}