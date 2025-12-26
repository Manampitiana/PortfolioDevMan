import { createContext, useContext, useState, useEffect } from 'react';
import { useSettings } from './SettingsContext';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const { settings } = useSettings();
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  // Mampiditra ny loko avy amin'ny DB ho CSS Variable
  const themeVariable = {
    "--theme-color": settings?.theme_color || '',
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div style={themeVariable} className="contents">
        {children}
      </div>
    </ThemeContext.Provider>
  );
};