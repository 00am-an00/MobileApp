import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { useMovieStore } from '@/store/movies';
import { getImageUrl } from '@/utils/api';
import Animated, { FadeIn, FadeOutRight } from 'react-native-reanimated';
import { Trash2 } from 'lucide-react-native';

export default function FavoritesScreen() {
  const favorites = useMovieStore((state) => state.favorites);
  const removeFavorite = useMovieStore((state) => state.removeFavorite);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <Text style={[styles.header, { color: isDark ? '#fff' : '#000' }]}>
        Favorites
      </Text>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOutRight}
            style={[styles.movieItem, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
            <TouchableOpacity
              style={styles.movieContent}
              onPress={() => router.push(`/movie/${item.id}`)}>
              <Image
                source={{ uri: getImageUrl(item.poster_path) }}
                style={styles.poster}
              />
              <View style={styles.movieInfo}>
                <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
                  {item.title}
                </Text>
                <Text style={[styles.year, { color: isDark ? '#888' : '#666' }]}>
                  {new Date(item.release_date).getFullYear()}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeFavorite(item.id)}>
              <Trash2 size={20} color="#ff4757" />
            </TouchableOpacity>
          </Animated.View>
        )}
        contentContainerStyle={styles.list}
      />

      {favorites.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: isDark ? '#fff' : '#000' }]}>
            No favorites yet
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  list: {
    padding: 16,
  },
  movieItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  movieContent: {
    flex: 1,
    flexDirection: 'row',
  },
  poster: {
    width: 60,
    height: 90,
    borderRadius: 8,
  },
  movieInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  year: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  removeButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    opacity: 0.6,
  },
});