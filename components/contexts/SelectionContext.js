import { createContext, useReducer } from "react";

// Action types
export const SELECTION_ACTIONS = {
  SELECT_ITEM: 'SELECT_ITEM',
  DESELECT_ITEM: 'DESELECT_ITEM',
  TOGGLE_ITEM: 'TOGGLE_ITEM',
  CLEAR_SELECTION: 'CLEAR_SELECTION',
  SELECT_ALL: 'SELECT_ALL',
  SET_SELECTED_ITEMS: 'SET_SELECTED_ITEMS',
  ENTER_SELECTION_MODE: 'ENTER_SELECTION_MODE',
  EXIT_SELECTION_MODE: 'EXIT_SELECTION_MODE'
};

// Initial state
const initialState = {
  selectedItems: new Set(), // Using Set for O(1) lookups and uniqueness
  selectedCount: 0,
  isSelectionMode: false // New: tracks if we're in selection mode
};

// Reducer function
function selectionReducer(state, action) {
  switch (action.type) {
    case SELECTION_ACTIONS.SELECT_ITEM: {
      const newSelected = new Set(state.selectedItems);
      newSelected.add(action.payload);
      return {
        selectedItems: newSelected,
        selectedCount: newSelected.size
      };
    }

    case SELECTION_ACTIONS.DESELECT_ITEM: {
      const newSelected = new Set(state.selectedItems);
      newSelected.delete(action.payload);
      return {
        selectedItems: newSelected,
        selectedCount: newSelected.size
      };
    }

    case SELECTION_ACTIONS.TOGGLE_ITEM: {
      const newSelected = new Set(state.selectedItems);
      if (newSelected.has(action.payload)) {
        newSelected.delete(action.payload);
      } else {
        newSelected.add(action.payload);
      }
      return {
        selectedItems: newSelected,
        selectedCount: newSelected.size
      };
    }

    case SELECTION_ACTIONS.CLEAR_SELECTION: {
      return {
        selectedItems: new Set(),
        selectedCount: 0
      };
    }

    case SELECTION_ACTIONS.SELECT_ALL: {
      const newSelected = new Set([...state.selectedItems, ...action.payload]);
      return {
        selectedItems: newSelected,
        selectedCount: newSelected.size
      };
    }

    case SELECTION_ACTIONS.SET_SELECTED_ITEMS: {
      const newSelected = new Set(action.payload);
      return {
        selectedItems: newSelected,
        selectedCount: newSelected.size
      };
    }

    case SELECTION_ACTIONS.ENTER_SELECTION_MODE: {
      return {
        ...state,
        isSelectionMode: true
      };
    }

    case SELECTION_ACTIONS.EXIT_SELECTION_MODE: {
      return {
        ...state,
        isSelectionMode: false,
        selectedItems: new Set(),
        selectedCount: 0
      };
    }

    default:
      return state;
  }
}

// Create context
export const SelectionContext = createContext({});

// Provider component
export default function SelectionProvider({ children }) {
  const [state, dispatch] = useReducer(selectionReducer, initialState);

  // Helper functions for easier usage
  const selectItem = (itemId) => {
    dispatch({ type: SELECTION_ACTIONS.SELECT_ITEM, payload: itemId });
  };

  const deselectItem = (itemId) => {
    dispatch({ type: SELECTION_ACTIONS.DESELECT_ITEM, payload: itemId });
  };

  const toggleItem = (itemId) => {
    dispatch({ type: SELECTION_ACTIONS.TOGGLE_ITEM, payload: itemId });
  };

  const clearSelection = () => {
    dispatch({ type: SELECTION_ACTIONS.CLEAR_SELECTION });
  };

  const selectAll = (itemIds) => {
    dispatch({ type: SELECTION_ACTIONS.SELECT_ALL, payload: itemIds });
  };

  const setSelectedItems = (itemIds) => {
    dispatch({ type: SELECTION_ACTIONS.SET_SELECTED_ITEMS, payload: itemIds });
  };

  const enterSelectionMode = () => {
    dispatch({ type: SELECTION_ACTIONS.ENTER_SELECTION_MODE });
  };

  const exitSelectionMode = () => {
    dispatch({ type: SELECTION_ACTIONS.EXIT_SELECTION_MODE });
  };

  const isSelected = (itemId) => {
    return state.selectedItems.has(itemId);
  };

  const value = {
    ...state,
    selectItem,
    deselectItem,
    toggleItem,
    clearSelection,
    selectAll,
    setSelectedItems,
    enterSelectionMode,
    exitSelectionMode,
    isSelected,
    dispatch // Expose dispatch for advanced usage if needed
  };

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}