import { createContext, useContext } from "react";
import useSelection from "../hooks/useSelection";

export const SelectionContext = createContext({});

export default function SelectionProvider({ children }) {
    const selection = useSelection();
    
    return (
        <SelectionContext.Provider value={selection}>
            {children}
        </SelectionContext.Provider>
    );
}

export const useSelectionContext = () => {
    const context = useContext(SelectionContext);
    if(!context) {
        throw new Error("useSelectionContext must be used within a SelectionProvider");
    }
    return context;
}