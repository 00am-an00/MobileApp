import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { getPopularMovies, getImageUrl } from '@/utils/api';
import { Movie } from '@/types/tmdb';

export default function DiscoverScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const loadMovies = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const data = await getPopularMovies(page);
      setMovies((prev) => [...prev, ...data.results]);
      setPage((p) => p + 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, loading]);

  const renderMovie = ({ item, index }: { item: Movie; index: number }) => (
    <Animated.View
      entering={FadeInUp.delay(index * 100)}
      style={styles.movieCard}>
      <TouchableOpacity
        onPress={() => router.push(`/movie/${item.id}`)}
        style={styles.cardContent}>
        <Image
          source={{ uri: getImageUrl(item.poster_path) }}
          style={styles.poster}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.year}>
            {new Date(item.release_date).getFullYear()}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <Text style={[styles.header, { color: isDark ? '#fff' : '#000' }]}>
        Popular Movies
      </Text>
      <FlatList
        data={movies}
        renderItem={renderMovie}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        onEndReached={loadMovies}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.list}
        onRefresh={loadMovies}
        refreshing={loading}
      />
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
    padding: 8,
  },
  movieCard: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    aspectRatio: 2/3,
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    padding: 12,
    justifyContent: 'flex-end',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  year: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    opacity: 0.8,
  },
});