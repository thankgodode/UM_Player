// import { MaterialIcons, Octicons } from "@expo/vector-icons";
// import { useRef } from "react";
// import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import ActionSheet, { ActionSheetRef, SheetProps } from "react-native-actions-sheet";

// export default function KebabBottomSheet(props: SheetProps<'kebab-bottomsheet'>) {
//    const payload = props.payload;
 
//   return (
//     <>
//       {/* <TouchableOpacity onPress={() => actionSheetRef.current?.show()}>
//         <MaterialIcons name="more-vert" size={24} color="grey"/>
//       </TouchableOpacity> */}
//       <ActionSheet overdrawSize={100} gestureEnabled>
//         <View style={styles.sheetTitle}>
//           <Text style={{color:"grey"}}>{payload.name}</Text>
//         </View>
//         <View style={styles.sheetList}>
//           <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
//             <MaterialIcons name="folder-zip" size={20} />
//             <Text>Lock in Private Folder</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.sheetList}>
//           <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
//             <MaterialIcons name="headphones" size={20} />
//             <Text>Background Play</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.sheetList}>
//           <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
//             <MaterialIcons name="playlist-add" size={20}/>
//             <Text>Add to Playlist</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.sheetList}>
//           <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
//             <Octicons name="diff-renamed" size={20} />
//             <Text>Rename</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.sheetList}>
//           <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
//             <MaterialIcons name="delete" size={20}/>
//             <Text>Delete</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.sheetList}>
//           <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
//             <MaterialIcons name="share" size={20}/>
//             <Text>Share</Text>
//           </TouchableOpacity>
//         </View>
//       </ActionSheet>
//     </>
//   );
// }

// export function VideoBottomSheet({ name }) {
//   const actionSheetRef = useRef<ActionSheetRef>(null);
 
//   return (
//     <>
//       <ActionSheet overdrawSize={100} gestureEnabled ref={actionSheetRef}>
//         <View style={styles.sheetTitle}>
//           <Text style={{color:"grey"}}>{name}</Text>
//         </View>
//         <View style={styles.sheetList}>
//           <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
//             <MaterialIcons name="folder-zip" size={20} />
//             <Text>Lock in Private Folder</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.sheetList}>
//           <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
//             <MaterialIcons name="headphones" size={20} />
//             <Text>Background Play</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.sheetList}>
//           <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
//             <MaterialIcons name="playlist-add" size={20}/>
//             <Text>Convert to MP3</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.sheetList}>
//           <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
//             <Octicons name="diff-renamed" size={20} />
//             <Text>Rename</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.sheetList}>
//           <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
//             <Octicons name="diff-renamed" size={20} />
//             <Text>Edit</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.sheetList}>
//           <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
//             <MaterialIcons name="delete" size={20}/>
//             <Text>Delete</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.sheetList}>
//           <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
//             <MaterialIcons name="share" size={20}/>
//             <Text>Share</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.sheetList}>
//           <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
//             <MaterialIcons name="share" size={20}/>
//             <Text>Properties</Text>
//           </TouchableOpacity>
//         </View>
//       </ActionSheet>
//     </>
//   );
// }

// export function MusicBottomSheet({ name }) {
//   const actionSheetRef = useRef<ActionSheetRef>(null);
 
//   return (
//     <>
//       {/* <TouchableOpacity onPress={() => actionSheetRef.current?.show()}>
//         <MaterialIcons name="more-vert" size={24} color="grey"/>
//       </TouchableOpacity> */}
//       <ActionSheet overdrawSize={100} gestureEnabled ref={actionSheetRef}>
//         <View style={styles.sheetTitle}>
//           <Text style={{color:"grey"}}>{name}</Text>
//         </View>
//         <View style={styles.sheetList}>
//           <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
//             <MaterialIcons name="folder-zip" size={20} />
//             <Text>Lock in Private Folder</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.sheetList}>
//           <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
//             <MaterialIcons name="headphones" size={20} />
//             <Text>Background Play</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.sheetList}>
//           <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
//             <MaterialIcons name="playlist-add" size={20}/>
//             <Text>Convert to MP3</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.sheetList}>
//           <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
//             <Octicons name="diff-renamed" size={20} />
//             <Text>Rename</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.sheetList}>
//           <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
//             <Octicons name="diff-renamed" size={20} />
//             <Text>Edit</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.sheetList}>
//           <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
//             <MaterialIcons name="delete" size={20}/>
//             <Text>Delete</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.sheetList}>
//           <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
//             <MaterialIcons name="share" size={20}/>
//             <Text>Share</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.sheetList}>
//           <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
//             <MaterialIcons name="share" size={20}/>
//             <Text>Properties</Text>
//           </TouchableOpacity>
//         </View>
//       </ActionSheet>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   sheetTitle: {
//     padding: 20,
//     color: "red",
//     fontSize: 15,
//     borderBottomWidth: 1,
//     borderBottomColor:"grey",
//     fontWeight:600
//   },
//   sheetList: {
//     // padding: 10,
//     fontSize:10
//   }
// })

// Action.tsx

import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ActionSheet, { SheetManager, SheetProps } from "react-native-actions-sheet";

import useVideoActions from "../hooks/useVideoActions";
import { DeleteModal, HideLoadingModal } from "./ActionModal";

export default function KebabBottomSheet(props: SheetProps<'kebab-bottomsheet'>) {
  const payload = props.payload;

  return (
    <ActionSheet overdrawSize={100} gestureEnabled>
      <View style={styles.sheetTitle}>
        <Text style={{ color: "grey" }} numberOfLines={1}>{payload.name}</Text>
      </View>

      {/* Render content based on type */}
      {payload.type === "folder" && <FolderSheetContent payload={payload} />}
      {payload.type === "video" && <VideoSheetContent payload={payload} />}
      {payload.type === "all_videos" && <AllVideosSheetContent payload={payload} />}
    </ActionSheet>
  );
}

// ── Folder sheet ────────────────────────────────────────
function FolderSheetContent({ payload }) {
  const {
    deleting,
    showDeleteModal,
    setShowDeleteModal,
    handleConfirmDelete,
  } = useVideoActions({
    onSuccess: (action) => console.log(`${action} completed`),
  });

  const video = {uri:payload.uri}
  const selected = new Map([[payload.id, video]])
  
  const clearSelection = () =>{
    SheetManager.hide("kebab-bottomsheet")
  }

  return (
    <>
      <DeleteModal
        visible={showDeleteModal}
        deleting={deleting}
        onConfirm={()=> handleConfirmDelete(selected,clearSelection,"folder")}
        onCancel={() => setShowDeleteModal(false)}
      />
      <Link onPress={()=> SheetManager.hide("kebab-bottomsheet")} href={
        {
          pathname: payload.pathname, 
          params: { title: payload.name, path:payload.path,folder:payload.root},
        }

      } asChild>
        <SheetItem icon="drive-folder-upload" label="Open Folder" onPress={() => { }} />
      </Link>
      {/* <SheetItem icon="folder-zip" label="Lock in Private Folder" onPress={() => {}} /> */}
      <SheetItem icon="headphones" label="Background Play" onPress={() => {}} />
      <SheetItem icon="playlist-add" label="Add to Playlist" onPress={() => {}} />
      <SheetItem icon="delete" label="Delete" onPress={() => {
        setShowDeleteModal(true)
      }} />
      <SheetItem icon="share" label="Share" onPress={() => {}} />
    </>
  );
}

// ── Single video in a folder ────────────────────────────
function VideoSheetContent({ payload }) {
  const {
    hiding,
    deleting,
    showDeleteModal,
    setShowDeleteModal,
    handleConfirmDelete,
    hideSelectedVideos
  } = useVideoActions({
    onSuccess: (action) => console.log(`${action} completed`),
  });

  const video = {
    uri: payload.uri,
    originalUri: payload.uri,
    filename: payload.name,
    duration: payload.duration
  }

  const selected = new Map([[payload.id, video]])

  const clearSelection = () =>{
    SheetManager.hide("kebab-bottomsheet")
  }

  return (
    <>
      <HideLoadingModal visible={hiding} count={selected.size} label={"Hiding"} />
      <DeleteModal
        visible={showDeleteModal}
        deleting={deleting}
        onConfirm={()=> handleConfirmDelete(selected,clearSelection)}
        onCancel={() => setShowDeleteModal(false)}
      />
      <SheetItem icon="folder-zip" label="Lock in Private Folder" onPress={() => {
        hideSelectedVideos(selected,clearSelection)
      }} />
      <SheetItem icon="headphones" label="Background Play" onPress={() => {}} />
      <SheetItem icon="playlist-add" label="Add to Playlist" onPress={() => {}} />
      <SheetItem icon="drive-file-rename-outline" label="Rename" onPress={() => {}} />
      <SheetItem icon="edit" label="Edit" onPress={() => {}} />
      <SheetItem icon="delete" label="Delete" onPress={() => {
        setShowDeleteModal(true)
      }} />
      <SheetItem icon="share" label="Share" onPress={() => {}} />
      <SheetItem icon="info" label="Properties" onPress={() => {}} />
    </>
  );
}

// ── Video in all videos tab ─────────────────────────────
function AllVideosSheetContent({ payload }) {
  return (
    <>
      <SheetItem icon="folder-zip" label="Lock in Private Folder" onPress={() => {}} />
      <SheetItem icon="headphones" label="Background Play" onPress={() => {}} />
      <SheetItem icon="queue-music" label="Convert to MP3" onPress={() => {}} />
      <SheetItem icon="drive-file-rename-outline" label="Rename" onPress={() => {}} />
      <SheetItem icon="delete" label="Delete" onPress={() => {}} />
      <SheetItem icon="share" label="Share" onPress={() => {}} />
      <SheetItem icon="info" label="Properties" onPress={() => {}} />
    </>
  );
}

// ── Reusable sheet item ─────────────────────────────────
function SheetItem({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <MaterialIcons name={icon} size={20} />
      <Text>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  sheetTitle: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
  },
  item: {
    flexDirection: "row",
    gap: 15,
    padding: 15,
  },
});