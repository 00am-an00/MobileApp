import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes, Theme } from '@/utils/themes';

interface ThemeStore {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  loadTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  currentTheme: themes[0],
  setTheme: (themeId) => {
    const theme = themes.find((t) => t.id === themeId) || themes[0];
    AsyncStorage.setItem('selected_theme', themeId);
    set({ currentTheme: theme });
  },
  loadTheme: async () => {
    const storedTheme = await AsyncStorage.getItem('selected_theme');
    if (storedTheme) {
      const theme = themes.find((t) => t.id === storedTheme) || themes[0];
      set({ currentTheme: theme });
    }
  },
}));