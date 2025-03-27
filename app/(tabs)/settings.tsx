import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { themes } from '@/utils/themes';
import { useThemeStore } from '@/store/theme';

export default function SettingsScreen() {
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const setTheme = useThemeStore((state) => state.setTheme);

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <Text style={[styles.header, { color: currentTheme.colors.text }]}>
        Appearance
      </Text>
      <Text style={[styles.description, { color: currentTheme.colors.text }]}>
        Choose a theme that matches your mood
      </Text>

      <View style={styles.themesGrid}>
        {themes.map((theme, index) => (
          <Animated.View
            key={theme.id}
            entering={FadeInUp.delay(index * 100)}
            style={styles.themeCard}>
            <TouchableOpacity
              onPress={() => setTheme(theme.id)}
              style={[
                styles.themeButton,
                {
                  borderColor:
                    currentTheme.id === theme.id
                      ? theme.colors.primary
                      : 'transparent',
                },
              ]}>
              <Image
                source={{ uri: theme.preview.image }}
                style={styles.themePreview}
              />
              <LinearGradient
                colors={theme.preview.gradient}
                style={styles.themeOverlay}
              />
              <View style={styles.themeInfo}>
                <Text style={styles.themeName}>{theme.name}</Text>
                {currentTheme.id === theme.id && (
                  <Text style={styles.activeLabel}>Active</Text>
                )}
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    marginBottom: 24,
    opacity: 0.8,
  },
  themesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  themeCard: {
    width: '47%',
    aspectRatio: 1,
  },
  themeButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
  },
  themePreview: {
    width: '100%',
    height: '100%',
  },
  themeOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.7,
  },
  themeInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  themeName: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  activeLabel: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    opacity: 0.8,
    marginTop: 4,
  },
});