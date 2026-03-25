import React, { createContext, useContext, useEffect, useState } from 'react';
import themeConfig from '../constants/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'light'
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const currentThemeConfig = {
    ...themeConfig,
    colors: {
      ...themeConfig.colors,
      mode: theme === 'dark' ? themeConfig.colors.background.dark : themeConfig.colors.background.light
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themeConfig: currentThemeConfig }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
