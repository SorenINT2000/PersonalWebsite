import React, { useState, useEffect, createContext } from "react";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { type PaletteMode } from "@mui/material";

declare module '@mui/material/styles' {
    interface TypographyVariants {
        duolingo: React.CSSProperties;
    }

    // allow configuration using `createTheme`
    interface TypographyVariantsOptions {
        duolingo?: React.CSSProperties;
    }

    interface TypeText {
        duoStreak?: string;
    }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        duolingo: true;
    }
}

const ThemeContext = createContext<{
    themeMode: PaletteMode;
    setThemeMode: (themeMode: PaletteMode) => void;
}>({
    themeMode: "dark",
    setThemeMode: () => { },
});

function ThemeContextProvider({ children }: { children: React.ReactNode }) {
    const getValidThemeMode = (): PaletteMode => {
        const storedTheme = localStorage.getItem("themeMode");
        return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'dark';
    };

    const [themeMode, setThemeMode] = useState<PaletteMode>(getValidThemeMode());
    const theme = createTheme({
        palette: {
            mode: themeMode ?? "dark",
            primary: {
                main: themeMode === 'dark' ? '#90caf9' : '#1976d2',
                light: themeMode === 'dark' ? '#e3f2fd' : '#42a5f5',
                dark: themeMode === 'dark' ? '#1565c0' : '#1565c0',
            },
            secondary: {
                main: themeMode === 'dark' ? '#f48fb1' : '#9c27b0',
                light: themeMode === 'dark' ? '#fce4ec' : '#ba68c8',
                dark: themeMode === 'dark' ? '#c2185b' : '#7b1fa2',
            },
            background: {
                default: themeMode === 'dark' ? '#121212' : '#f5f5f5',
                paper: themeMode === 'dark' ? '#1e1e1e' : '#ffffff',
            },
            text: {
                primary: themeMode === 'dark' ? '#ffffff' : '#2c3e50',
                secondary: themeMode === 'dark' ? '#b0bec5' : '#546e7a',
                duoStreak: 'rgb(255, 171, 51)',
            },
        },
        typography: {
            h6: {
                fontFamily: "serif",
                textTransform: "none",
                fontSize: 24,
                fontWeight: 600,
            },
            body1: {
                fontFamily: "serif",
                textTransform: "none",
                fontSize: 18,
            },
            body2: {
                fontFamily: "serif",
                textTransform: "none",
                fontSize: 16,
            },
            duolingo: {
                fontFamily: "din-round,sans-serif",
                textTransform: "none",
                fontSize: 16,
                lineHeight: 1,
            }
        },
        components: {
            MuiAvatar: {
                styleOverrides: {
                    root: {
                        backgroundColor: themeMode === 'dark' ? '#90caf9' : '#1976d2',
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: {
                        backgroundColor: themeMode === 'dark' ? 'rgba(144, 202, 249, 0.1)' : 'rgba(25, 118, 210, 0.1)',
                        '&:hover': {
                            backgroundColor: themeMode === 'dark' ? 'rgba(144, 202, 249, 0.2)' : 'rgba(25, 118, 210, 0.2)',
                        },
                    },
                },
            },
            MuiDivider: {
                styleOverrides: {
                    root: {
                        borderColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                    },
                },
            },
        },
    });

    useEffect(() => {
        localStorage.setItem("themeMode", theme.palette.mode);
        setThemeMode(theme.palette.mode);
    }, [theme.palette.mode, themeMode]);

    return (
        <ThemeContext.Provider
            value={{
                themeMode,
                setThemeMode,
            }}
        >
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}

export { ThemeContext };
export default ThemeContextProvider;
