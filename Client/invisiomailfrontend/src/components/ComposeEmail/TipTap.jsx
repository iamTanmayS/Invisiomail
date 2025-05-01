import {
    AppBar,
    Box,
    CssBaseline,
    IconButton,
    ThemeProvider,
    Toolbar,
    Typography,
    createTheme,
    useMediaQuery,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";

import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Editor from "./Editor";

export default function TipTap() {
    const systemSettingsPrefersDarkMode = useMediaQuery(
        "(prefers-color-scheme: dark)"
    );
    const [paletteMode, setPaletteMode] = useState(
        systemSettingsPrefersDarkMode ? "dark" : "light"
    );
    const togglePaletteMode = useCallback(
        () =>
            setPaletteMode((prevMode) => (prevMode === "light" ? "dark" : "light")),
        []
    );
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: paletteMode,
                    secondary: {
                        main: "#42B81A",
                    },
                },
            }),
        [paletteMode]
    );

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{
                p: 3,
                maxWidth: 1207,
                margin: "0 auto",
                height: "100vh",
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Box sx={{
                    flex: 1,
                    overflowY: 'auto',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#888',
                        borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: '#555',
                    }
                }}>
                    <Editor />
                </Box>
            </Box>
        </ThemeProvider>
    );
}