import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Search as SearchIcon } from 'lucide-react-native';
import { searchMovies, getImageUrl } from '@/utils/api';
import { Movie } from '@/types/tmdb';
import Animated, { FadeIn, FadeInRight } from 'react-native-reanimated';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleSearch = useCallback(async (text: string) => {
    setQuery(text);
    if (text.length < 2) {
      setMovies([]);
      return;
    }
    setLoading(true);
    try {
      const data = await searchMovies(text);
      setMovies(data.results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <Animated.View entering={FadeIn} style={styles.searchContainer}>
        <SearchIcon size={20} color={isDark ? '#fff' : '#000'} />
        <TextInput
          style={[styles.input, { color: isDark ? '#fff' : '#000' }]}
          placeholder="Search movies..."
          placeholderTextColor={isDark ? '#666' : '#999'}
          value={query}
          onChangeText={handleSearch}
        />
      </Animated.View>

      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInRight.delay(index * 100)}>
            <TouchableOpacity
              style={[styles.movieItem, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}
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
                <Text
                  numberOfLines={2}
                  style={[styles.overview, { color: isDark ? '#888' : '#666' }]}>
                  {item.overview}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  movieItem: {
    flexDirection: 'row',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  movieInfo: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  year: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginBottom: 8,
  },
  overview: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
});