// components/SubtitleModal.jsx
import { useState } from "react";
import {
  Modal, View, Text, TextInput, TouchableOpacity, FlatList,
  ActivityIndicator, StyleSheet, TouchableWithoutFeedback,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  pickSubtitleFile,
  searchOnlineSubtitles,
  downloadOnlineSubtitle,
} from "../utils/subtitleManager";

export default function SubtitleModal({ visible, onClose, onSubtitleLoaded, videoTitle }) {
  const [tab, setTab] = useState("device"); // 'device' | 'online'
  const [query, setQuery] = useState(videoTitle || "");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [error, setError] = useState("");

  async function handlePickLocal() {
    setError("");
    try {
      const result = await pickSubtitleFile();
      if (result) {
        onSubtitleLoaded(result);
        onClose();
      }
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleSearch() {
    if (!query.trim()) return;
    setSearching(true);
    setError("");
    try {
      const items = await searchOnlineSubtitles(query);
      setResults(items);
    } catch (e) {
      setError("Failed to search. Check your connection.");
    } finally {
      setSearching(false);
    }
  }

  async function handleDownload(item) {
    setDownloadingId(item.id);
    setError("");
    try {
      const result = await downloadOnlineSubtitle(item.fileId);
      onSubtitleLoaded(result);
      onClose();
    } catch (e) {
      setError("Failed to download subtitle");
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <View style={styles.header}>
                <Text style={styles.title}>Subtitles</Text>
                <TouchableOpacity onPress={onClose}>
                  <MaterialIcons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Tabs */}
              <View style={styles.tabs}>
                <TouchableOpacity
                  style={[styles.tab, tab === "device" && styles.tabActive]}
                  onPress={() => setTab("device")}
                >
                  <Text style={styles.tabText}>From Device</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, tab === "online" && styles.tabActive]}
                  onPress={() => setTab("online")}
                >
                  <Text style={styles.tabText}>Search Online</Text>
                </TouchableOpacity>
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              {tab === "device" && (
                <TouchableOpacity style={styles.pickBtn} onPress={handlePickLocal}>
                  <MaterialIcons name="folder-open" size={20} color="#fff" />
                  <Text style={styles.pickBtnText}>Choose .srt / .vtt file</Text>
                </TouchableOpacity>
              )}

              {tab === "online" && (
                <>
                  <View style={styles.searchRow}>
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search by movie/show title"
                      placeholderTextColor="#888"
                      value={query}
                      onChangeText={setQuery}
                      onSubmitEditing={handleSearch}
                    />
                    <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
                      {searching ? (
                        <ActivityIndicator color="#fff" size="small" />
                      ) : (
                        <MaterialIcons name="search" size={22} color="#fff" />
                      )}
                    </TouchableOpacity>
                  </View>

                  <FlatList
                    data={results}
                    keyExtractor={(item) => item.id}
                    style={{ maxHeight: 300 }}
                    ListEmptyComponent={
                      !searching && (
                        <Text style={styles.emptyText}>
                          Search for subtitles by title
                        </Text>
                      )
                    }
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.resultRow}
                        onPress={() => handleDownload(item)}
                        disabled={downloadingId === item.id}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={styles.resultTitle} numberOfLines={1}>
                            {item.title}
                          </Text>
                          <Text style={styles.resultMeta}>
                            {item.language.toUpperCase()} · {item.downloadCount} downloads
                          </Text>
                        </View>
                        {downloadingId === item.id ? (
                          <ActivityIndicator color="#fff" size="small" />
                        ) : (
                          <MaterialIcons name="download" size={20} color="#fff" />
                        )}
                      </TouchableOpacity>
                    )}
                  />
                </>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" },
  sheet: { backgroundColor: "#1a1a1a", borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20, maxHeight: "70%" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { color: "#fff", fontSize: 18, fontWeight: "700" },
  tabs: { flexDirection: "row", gap: 8, marginBottom: 16 },
  tab: { flex: 1, padding: 10, borderRadius: 8, backgroundColor: "#2a2a2a", alignItems: "center" },
  tabActive: { backgroundColor: "rgb(97, 149, 177)" },
  tabText: { color: "#fff", fontWeight: "600" },
  error: { color: "#ff5f5f", marginBottom: 12, fontSize: 13 },
  pickBtn: { flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "center", backgroundColor: "#2a2a2a", padding: 16, borderRadius: 10 },
  pickBtnText: { color: "#fff", fontWeight: "600" },
  searchRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  searchInput: { flex: 1, backgroundColor: "#2a2a2a", color: "#fff", padding: 12, borderRadius: 8 },
  searchBtn: { backgroundColor: "rgb(97, 149, 177)", padding: 12, borderRadius: 8, justifyContent: "center", alignItems: "center", width: 46 },
  resultRow: { flexDirection: "row", alignItems: "center", padding: 12, borderBottomWidth: 1, borderBottomColor: "#2a2a2a", gap: 8 },
  resultTitle: { color: "#fff", fontSize: 14, fontWeight: "600" },
  resultMeta: { color: "#888", fontSize: 12, marginTop: 2 },
  emptyText: { color: "#888", textAlign: "center", padding: 20 },
});