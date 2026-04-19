import { MaterialIcons, Octicons } from "@expo/vector-icons";
import { useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ActionSheet, { ActionSheetRef, SheetProps } from "react-native-actions-sheet";

export default function KebabBottomSheet(props: SheetProps<'kebab-bottomsheet'>) {
   const payload = props.payload;
 
  return (
    <>
      {/* <TouchableOpacity onPress={() => actionSheetRef.current?.show()}>
        <MaterialIcons name="more-vert" size={24} color="grey"/>
      </TouchableOpacity> */}
      <ActionSheet overdrawSize={100} gestureEnabled>
        <View style={styles.sheetTitle}>
          <Text style={{color:"grey"}}>{payload.name}</Text>
        </View>
        <View style={styles.sheetList}>
          <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
            <MaterialIcons name="folder-zip" size={20} />
            <Text>Lock in Private Folder</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sheetList}>
          <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
            <MaterialIcons name="headphones" size={20} />
            <Text>Background Play</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sheetList}>
          <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
            <MaterialIcons name="playlist-add" size={20}/>
            <Text>Add to Playlist</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sheetList}>
          <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
            <Octicons name="diff-renamed" size={20} />
            <Text>Rename</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sheetList}>
          <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
            <MaterialIcons name="delete" size={20}/>
            <Text>Delete</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sheetList}>
          <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
            <MaterialIcons name="share" size={20}/>
            <Text>Share</Text>
          </TouchableOpacity>
        </View>
      </ActionSheet>
    </>
  );
}

export function VideoBottomSheet({ name }) {
  const actionSheetRef = useRef<ActionSheetRef>(null);
 
  return (
    <>
      <ActionSheet overdrawSize={100} gestureEnabled ref={actionSheetRef}>
        <View style={styles.sheetTitle}>
          <Text style={{color:"grey"}}>{name}</Text>
        </View>
        <View style={styles.sheetList}>
          <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
            <MaterialIcons name="folder-zip" size={20} />
            <Text>Lock in Private Folder</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sheetList}>
          <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
            <MaterialIcons name="headphones" size={20} />
            <Text>Background Play</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sheetList}>
          <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
            <MaterialIcons name="playlist-add" size={20}/>
            <Text>Convert to MP3</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sheetList}>
          <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
            <Octicons name="diff-renamed" size={20} />
            <Text>Rename</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sheetList}>
          <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
            <Octicons name="diff-renamed" size={20} />
            <Text>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sheetList}>
          <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
            <MaterialIcons name="delete" size={20}/>
            <Text>Delete</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sheetList}>
          <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
            <MaterialIcons name="share" size={20}/>
            <Text>Share</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sheetList}>
          <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
            <MaterialIcons name="share" size={20}/>
            <Text>Properties</Text>
          </TouchableOpacity>
        </View>
      </ActionSheet>
    </>
  );
}

export function MusicBottomSheet({ name }) {
  const actionSheetRef = useRef<ActionSheetRef>(null);
 
  return (
    <>
      {/* <TouchableOpacity onPress={() => actionSheetRef.current?.show()}>
        <MaterialIcons name="more-vert" size={24} color="grey"/>
      </TouchableOpacity> */}
      <ActionSheet overdrawSize={100} gestureEnabled ref={actionSheetRef}>
        <View style={styles.sheetTitle}>
          <Text style={{color:"grey"}}>{name}</Text>
        </View>
        <View style={styles.sheetList}>
          <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
            <MaterialIcons name="folder-zip" size={20} />
            <Text>Lock in Private Folder</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sheetList}>
          <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
            <MaterialIcons name="headphones" size={20} />
            <Text>Background Play</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sheetList}>
          <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
            <MaterialIcons name="playlist-add" size={20}/>
            <Text>Convert to MP3</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sheetList}>
          <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
            <Octicons name="diff-renamed" size={20} />
            <Text>Rename</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sheetList}>
          <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
            <Octicons name="diff-renamed" size={20} />
            <Text>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sheetList}>
          <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
            <MaterialIcons name="delete" size={20}/>
            <Text>Delete</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sheetList}>
          <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
            <MaterialIcons name="share" size={20}/>
            <Text>Share</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sheetList}>
          <TouchableOpacity style={{flexDirection:"row", gap:15,padding:15}}>
            <MaterialIcons name="share" size={20}/>
            <Text>Properties</Text>
          </TouchableOpacity>
        </View>
      </ActionSheet>
    </>
  );
}

const styles = StyleSheet.create({
  sheetTitle: {
    padding: 20,
    color: "red",
    fontSize: 15,
    borderBottomWidth: 1,
    borderBottomColor:"grey",
    fontWeight:600
  },
  sheetList: {
    // padding: 10,
    fontSize:10
  }
})