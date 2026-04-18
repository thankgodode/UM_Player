import { useContext } from "react";
import { SelectionContext } from "../contexts/SelectionContext";

export function useIsSelected(fileName) {
  const { selected } = useContext(SelectionContext);
  return !!selected[fileName];
}