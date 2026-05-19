import { useEffect, useState } from "react";
import RNFS from "react-native-fs";

export default function usePath() {
    const [paths, setPaths] = useState(null);
    useEffect(() => { 
        function getFilePaths() {
            const paths = RNFS.ExternalDirectoryPath;
            setPaths(paths);
        }

        getFilePaths();
    }, [])
    
    return {paths}
}