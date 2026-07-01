import { useCallback, useState } from "react";

export default function useSelection() {
    const [selected, setSelected] = useState(new Map());
    const [isSelecting, setIsSelecting] = useState(false);
    

    const enterSelectionMode = useCallback((video) => {
        setIsSelecting(true);
        setSelected(new Map([[video.id, video]])); // 👈 store full video object
    }, []);

    const toggleSelect = useCallback((video) => {
        setSelected((prevSelected) => {
            const newSelected = new Map(prevSelected);
            if (newSelected.has(video.id)) {
                newSelected.delete(video.id);
            } else {
                newSelected.set(video.id, video); // 👈 store full video object
            }
            return newSelected;
        });
    }, []);

    const clearSelection = useCallback(() => {
        setIsSelecting(false);
        // setSelected(new Set());
        setSelected(new Map());
    }, []);
    
    return {
        toggleSelect,
        enterSelectionMode,
        clearSelection,
        isSelecting,
        selected
    }
}