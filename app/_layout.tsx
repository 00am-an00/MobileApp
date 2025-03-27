import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useMovieStore } from '@/store/movies';
import { useThemeStore } from '@/store/theme';

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const loadFavorites = useMovieStore((state) => state.loadFavorites);
  const loadReviews = useMovieStore((state) => state.loadReviews);
  const loadTheme = useThemeStore((state) => state.loadTheme);

  useEffect(() => {
    loadFavorites();
    loadReviews();
    loadTheme();
  }, [loadFavorites, loadReviews, loadTheme]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="movie/[id]" 
          options={{ 
            presentation: 'modal',
            headerShown: true,
            headerTitle: '',
            headerTransparent: true,
            headerTintColor: '#fff',
          }} 
        />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}