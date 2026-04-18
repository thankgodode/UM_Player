import { useCallback } from "react";

import { FlatList, StyleSheet } from "react-native";
import { useSelectionContext } from "../contexts/SelectionContext";
import { MusicFiles } from "./RenderFiles";

export function Songs({ paths }) {
    const { toggleSelect, enterSelectionMode, isSelecting, selected } = useSelectionContext();
    
    const renderItem = useCallback(({ item }) => {
        const pathSegments = item.split("/").filter(Boolean);
        const musicName = pathSegments[pathSegments.length - 1] || item;
        const splitExt = musicName.split(".")
        const extension = splitExt[splitExt.length-1]

        return (
            <MusicFiles
                isDirectory={false}
                fileType={extension}
                fileName={musicName}
                toggleSelect={toggleSelect}
                enterSelectionMode={enterSelectionMode}
                isSelecting={isSelecting}
                selected={selected.has(musicName)}
                path={item}
                count=""
            />
        );
    }, [isSelecting,enterSelectionMode,toggleSelect,selected]);

    return (
        <FlatList
            data={paths}
            keyExtractor={(item) => item}
            style={styles.flatList}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={renderItem}
        />
    )
}

export function Albums({ paths }) {
    const renderItem = useCallback(({ item }) => {
        return (
            <MusicFiles
                isDirectory={true}
                fileType={"album"}
                fileName={item.title}
                path={item.title}
                placeholder={item.artist}
                count={item.albumSongs}
            />
        );
    }, []);

    return (
        <FlatList
            data={paths}
            keyExtractor={(item) => item.id}
            style={styles.flatList}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={renderItem}
        />
    )
}

export function MusicFolders({ paths, count }) {
    const {toggleSelect,enterSelectionMode,isSelecting,selected} = useSelectionContext();
    
    const renderItem = useCallback(({ item }) => {
        const pathSegments = item.split("/").filter(Boolean);
        const folderName = pathSegments[pathSegments.length - 1] || item;
        
        return (
            <MusicFiles
                isDirectory={true}
                fileType=""
                fileName={folderName}
                path={item}
                count={count[item]}
                toggleSelect={toggleSelect}
                enterSelectionMode={enterSelectionMode}
                isSelecting={isSelecting}
                selected={selected.has(folderName)}
          />
        );
    }, [isSelecting,enterSelectionMode,toggleSelect,selected,count]);

    return (
        <FlatList
            data={paths}
            keyExtractor={(item) => item}
            style={styles.flatList}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={renderItem}
        />
    )
}

export function Artists({paths}) {
    const renderItem = useCallback(({ item }) => {
        return (
            <MusicFiles
                isDirectory={false}
                fileType={"artists"}
                fileName={item.title}
                path={item.title}
                count={item.artistSongs}
            />
        );
    }, []);

    return (
        <FlatList
            data={paths}
            keyExtractor={(item) => item.id}
            style={styles.flatList}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={renderItem}
        />
    )
}

const styles = StyleSheet.create({
    list: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom:15
    },
    folder: {
         flexDirection: "row",
        alignItems: "center",
        gap: 15
    },
    thumbnailWrapper: {
        width: 40,
        height:40,
    },
    thumbnailImage: {
        width: "100%",
        height:"100%"
    },
    artists: {
        color: "#ccc",
        fontSize:12
    },
    flatList: {
        width: 330,
        height:370,
        marginHorizontal:"auto"
    },
})