import { useCallback, useState } from "react";

export default function useSelection() {
    const [selected, setSelected] = useState(new Set());
    const [isSelecting, setIsSelecting] = useState(false);

    const enterSelectionMode = useCallback((id) => {
        setIsSelecting(true);
        setSelected(new Set([id]));
    },[]);

    const toggleSelect = useCallback((id) => {
        setSelected((prevSelected) => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(id)) {
                newSelected.delete(id);
            } else {
                newSelected.add(id);
            }
            return newSelected;
        });
    },[]);

    const clearSelection = useCallback(() => {
        setIsSelecting(false);
        setSelected(new Set());
    }, []);
    
    return {
        toggleSelect,
        enterSelectionMode,
        clearSelection,
        isSelecting,
        selected
    }
}