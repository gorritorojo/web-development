import type React from 'react';
import {
    createContext,
    useCallback,
    useContext,
    useLayoutEffect,
    useState,
} from 'react';
import type { Theme, ThemeContextValue } from '../types/app/theme.ts';

const ThemeContext = createContext<ThemeContextValue | null>(null);
const THEME_STORAGE_KEY = 'honya-theme';

function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() =>
        localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light'
    );

    useLayoutEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme((current) => (current === 'light' ? 'dark' : 'light'));
    }, []);

    return (
        <ThemeContext value={{ theme, toggleTheme }}>{children}</ThemeContext>
    );
}

function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used inside ThemeProvider');
    }
    return context;
}

export { ThemeProvider, useTheme };
