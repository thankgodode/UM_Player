import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { memo } from "react";
import { useSelection } from "../hooks/useSelection";

/**
 * Selection Mode Pattern:
 *
 * 1. Normal Mode (isSelectionMode = false):
 *    - Long press any item to enter selection mode
 *    - Regular press navigates (folders) or does default action (files)
 *    - No selection UI visible
 *
 * 2. Selection Mode (isSelectionMode = true):
 *    - Regular press toggles selection
 *    - Selection checkboxes are visible
 *    - ActionBar appears with bulk operations
 *    - Close button exits selection mode
 *
 * Usage in components:
 * - Use useSelection hook to get state and actions
 * - Check isSelectionMode to conditionally show selection UI
 * - Handle onLongPress to enter selection mode
 * - Handle onPress differently based on selection mode
 */
import KebabBottomSheet from "./Action";

const VIDEO_EXTENSIONS = [
  'mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm',
  'm4v', '3gp', '3g2', 'mpeg', 'mpg', 'ts', 'mts',
  'm2ts', 'vob', 'ogv', 'rm', 'rmvb', 'asf', 'divx',
];

const AUDIO_EXTENSIONS = [
    'mp3', 'wav', 'aac', 'flac',
    'ogg', 'm4a', 'wma'
];

function FileIcon({ isDirectory, fileType }) {
  if (fileType === 'pdf')
    return <MaterialCommunityIcons name="file-pdf-box" size={25} color="#9c9c9c" />;
  if (VIDEO_EXTENSIONS.includes(fileType))
    return <MaterialCommunityIcons name="video" size={25} color="#9c9c9c" />;
  if (AUDIO_EXTENSIONS.includes(fileType))
    return <MaterialCommunityIcons name="music" size={25} color="#9c9c9c" />;
  if (fileType==="album")
    return <MaterialCommunityIcons name="album" size={25} color="#9c9c9c" />;
  if (fileType === "artists")
    return ""
  if (isDirectory)
    return <MaterialCommunityIcons name="folder" size={25} color="#9c9c9c" />;
  
  return <MaterialCommunityIcons name="file" size={25} color="#9c9c9c" />;
}

const styles = style();

export function ContentFiles({ isDirectory, fileType, fileName, root }) {
  const content = (
    <>
      <FileIcon isDirectory={isDirectory} fileType={fileType} />
      <View>
        <Text style={styles.name}>{fileName}</Text>
        <Text style={styles.folderInfo}>Placeholder</Text>
      </View>
    </>
  );

  if (isDirectory) {
    return (
      <Link
        href={{
          pathname: `files/folder/storage/emulated/0/${fileName}`,
          params: { title: fileName, path: `${root}/${fileName}` },
        }}
        asChild
      >
        <TouchableOpacity style={styles.button}>{content}</TouchableOpacity>
      </Link>
    );
  }

  return <TouchableOpacity style={styles.button}>{content}</TouchableOpacity>;
}


export const VideoFiles = memo(function VideoFiles({ isDirectory, fileType, fileName, path, count }) {
  const { isSelected, toggleItem, isSelectionMode, enterSelectionMode, selectItem } = useSelection();

  // Create a unique ID for this item (using path for uniqueness)
  const itemId = `${isDirectory ? 'folder' : 'file'}-${path}`;

  const isItemSelected = isSelected(itemId);

  const handlePress = () => {
    if (isSelectionMode) {
      // In selection mode, toggle selection
      toggleItem(itemId);
    } else {
      // In normal mode, navigation is handled by Link component
    }
  };

  const handleLongPress = () => {
    console.log("SELECTION MODE ACTIVATED... ", isSelectionMode)
    if (!isSelectionMode) {
      // Enter selection mode and select this item
      enterSelectionMode();
      selectItem(itemId);
    }
  };

  const content = (
    <>
      {/* Selection indicator - only show in selection mode */}
      {isSelectionMode && (
        <TouchableOpacity
          onPress={() => toggleItem(itemId)}
          style={styles.selectionIndicator}
        >
          <MaterialCommunityIcons
            name={isItemSelected ? "checkbox-marked" : "checkbox-blank-outline"}
            size={20}
            color={isItemSelected ? "#007AFF" : "#9c9c9c"}
          />
        </TouchableOpacity>
      )}

      <FileIcon isDirectory={isDirectory} fileType={fileType} />
      <View style={{flexDirection:'row',alignItems:"center",gap:12}}>
        <Text style={[styles.name, isItemSelected && styles.selectedText]}>{fileName}</Text>
        <Text style={styles.folderInfo}>{count[path]}</Text>
      </View>
    </>
  );

  if (isDirectory) {
    return (
      <View style={{paddingTop: 3,paddingBottom:3, width:"100%",flexDirection:'row',alignItems:"center",justifyContent:"space-between"}}>
        {isSelectionMode ? (
          // In selection mode, use TouchableOpacity for selection
          <TouchableOpacity
            onPress={handlePress}
            onLongPress={handleLongPress}
            style={{flex:1, flexDirection: 'row', alignItems: 'center'}}
          >
            {content}
          </TouchableOpacity>
        ) : (
          // In normal mode, use Link for navigation
          <Link
            href={{
              pathname: `video/folder/storage/emulated/0/${fileName}`,
              params: { title: fileName, path: `${path}` },
            }}
            asChild
            style={{flex:1}}
          >
            <TouchableOpacity
              onLongPress={handleLongPress}
              style={{flexDirection: 'row', alignItems: 'center'}}
            >
              {content}
            </TouchableOpacity>
          </Link>
        )}
        <KebabBottomSheet name={fileName} />
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      onLongPress={handleLongPress}
      style={[styles.button, isItemSelected && styles.selectedButton]}
    >
      {content}
    </TouchableOpacity>
  );
})

export const MusicFiles = memo(function MusicFiles({ isDirectory, fileType, fileName, path, count }) {
  const { isSelected, toggleItem, isSelectionMode, enterSelectionMode, selectItem } = useSelection();

  // Create a unique ID for this item (using path for uniqueness)
  const itemId = `${isDirectory ? 'folder' : 'file'}-${path}`;

  const isItemSelected = isSelected(itemId);

  const handlePress = () => {
    if (isSelectionMode) {
      // In selection mode, toggle selection
      toggleItem(itemId);
    } else {
      // In normal mode, navigation is handled by Link component
    }
  };

  const handleLongPress = () => {
    if (!isSelectionMode) {
      // Enter selection mode and select this item
      enterSelectionMode();
      selectItem(itemId);
    }
  };

  const content = (
    <>
      {/* Selection indicator - only show in selection mode */}
      {isSelectionMode && (
        <TouchableOpacity
          onPress={() => toggleItem(itemId)}
          style={styles.selectionIndicator}
        >
          <MaterialCommunityIcons
            name={isItemSelected ? "checkbox-marked" : "checkbox-blank-outline"}
            size={20}
            color={isItemSelected ? "#007AFF" : "#9c9c9c"}
          />
        </TouchableOpacity>
      )}

      <FileIcon isDirectory={isDirectory} fileType={fileType} />
      <View style={{flexDirection:'row',alignItems:"center",gap:12}}>
        <Text style={[styles.name, isItemSelected && styles.selectedText]}>{fileName} </Text>
        <Text style={styles.folderInfo}>{!count?"":count[path]}</Text>
      </View>
    </>
  );

  if (isDirectory) {
    return (
      <Link
        href={{
          pathname: `music/folder/storage/emulated/0/${fileName}`,
          params: { title: fileName, path: `${path}` },
        }}
        asChild
      >
        <TouchableOpacity
          onLongPress={handleLongPress}
          style={{flexDirection: 'row', alignItems: 'center'}}
        >
          {content}
        </TouchableOpacity>
      </Link>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      onLongPress={handleLongPress}
      style={[styles.button, isItemSelected && styles.selectedButton]}
    >
      {content}
    </TouchableOpacity>
  );
})

function style() {
  return StyleSheet.create({
    button: {
      flexDirection: "row",
      gap: 15,
      paddingTop: 8,
      paddingBottom:8,
      alignItems: 'center'
    },
    selectedButton: {
      backgroundColor: 'rgba(0, 122, 255, 0.1)',
      borderRadius: 8,
      paddingHorizontal: 8
    },
    selectionIndicator: {
      padding: 4,
    },
    name: {
      fontSize: 17,
      fontWeight:400
    },
    selectedText: {
      color: '#007AFF',
      fontWeight: '500'
    },
    folderInfo: {
      color: "grey",
      fontSize:14
    }
  })
}