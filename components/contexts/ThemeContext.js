import { createContext, useState } from "react"
import { Colors } from "../constants/Colors"

export const ThemeContext = createContext({})

export default function ThemeProvider({children}) {
    const [colorScheme, setColorScheme] = useState("")
    const theme = colorScheme ==="dark"? Colors.dark : Colors.light

    return (
        <ThemeContext.Provider
            value={{colorScheme,theme,setColorScheme}}
        >
            {children}
        </ThemeContext.Provider>
    )
}