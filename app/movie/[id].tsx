import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Heart, Star, ArrowLeft } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { getMovieDetails, getImageUrl } from '@/utils/api';
import { useMovieStore } from '@/store/movies';
import { useThemeStore } from '@/store/theme';
import { MovieDetails, Review } from '@/types/tmdb';

export default function MovieScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const router = useRouter();
  const theme = useThemeStore((state) => state.currentTheme);

  const favorites = useMovieStore((state) => state.favorites);
  const reviews = useMovieStore((state) => state.reviews);
  const addFavorite = useMovieStore((state) => state.addFavorite);
  const removeFavorite = useMovieStore((state) => state.removeFavorite);
  const addReview = useMovieStore((state) => state.addReview);

  const isFavorite = favorites.some((f) => f.id === Number(id));
  const movieReview = reviews.find((r) => r.movieId === Number(id));

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const data = await getMovieDetails(Number(id));
        setMovie(data);
      } catch (error) {
        console.error(error);
      }
    };
    loadMovie();
  }, [id]);

  const handleReviewSubmit = () => {
    if (!movie) return;
    const newReview: Review = {
      id: Date.now().toString(),
      movieId: movie.id,
      rating,
      content: review,
      createdAt: new Date().toISOString(),
    };
    addReview(newReview);
    setReview('');
    setRating(0);
  };

  if (!movie) return null;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View entering={FadeIn} style={styles.header}>
        <Image
          source={{ uri: getImageUrl(movie.backdrop_path, 'original') }}
          style={styles.backdrop}
        />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}>
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <BlurView intensity={80} style={styles.overlay}>
          <Image
            source={{ uri: getImageUrl(movie.poster_path) }}
            style={styles.poster}
          />
          <View style={styles.headerInfo}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {movie.title}
            </Text>
            <Text style={[styles.tagline, { color: theme.colors.primary }]}>
              {movie.tagline}
            </Text>
            <View style={styles.genres}>
              {movie.genres.map((genre) => (
                <View 
                  key={genre.id} 
                  style={[styles.genre, { backgroundColor: `${theme.colors.primary}20` }]}>
                  <Text style={[styles.genreText, { color: theme.colors.primary }]}>
                    {genre.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </BlurView>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(200)}
        style={styles.content}>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.favoriteButton, { backgroundColor: `${theme.colors.primary}20` }]}
            onPress={() =>
              isFavorite ? removeFavorite(movie.id) : addFavorite(movie)
            }>
            <Heart
              size={24}
              color={theme.colors.primary}
              fill={isFavorite ? theme.colors.primary : 'none'}
            />
          </TouchableOpacity>
          <View style={styles.rating}>
            <Star size={20} color={theme.colors.rating} fill={theme.colors.rating} />
            <Text style={[styles.ratingText, { color: theme.colors.rating }]}>
              {movie.vote_average.toFixed(1)}/10
            </Text>
          </View>
        </View>

        <Text style={[styles.overview, { color: theme.colors.text }]}>
          {movie.overview}
        </Text>

        <View style={styles.reviewSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Write a Review
          </Text>
          <View style={styles.ratingInput}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}>
                <Star
                  size={24}
                  color={theme.colors.rating}
                  fill={rating >= star ? theme.colors.rating : 'none'}
                />
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={[
              styles.reviewInput,
              {
                color: theme.colors.text,
                borderColor: `${theme.colors.primary}20`,
              },
            ]}
            placeholder="Write your review..."
            placeholderTextColor={`${theme.colors.text}80`}
            multiline
            value={review}
            onChangeText={setReview}
          />
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleReviewSubmit}>
            <Text style={styles.submitButtonText}>Submit Review</Text>
          </TouchableOpacity>
        </View>

        {movieReview && (
          <View style={[styles.existingReview, { backgroundColor: `${theme.colors.primary}10` }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Your Review
            </Text>
            <View style={styles.ratingDisplay}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  color={theme.colors.rating}
                  fill={movieReview.rating >= star ? theme.colors.rating : 'none'}
                />
              ))}
            </View>
            <Text style={[styles.reviewText, { color: theme.colors.text }]}>
              {movieReview.content}
            </Text>
          </View>
        )}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 400,
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    flexDirection: 'row',
    padding: 20,
    paddingTop: 60,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 12,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    marginBottom: 12,
  },
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genre: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  content: {
    padding: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  favoriteButton: {
    padding: 12,
    borderRadius: 12,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  overview: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    lineHeight: 24,
    marginBottom: 24,
  },
  reviewSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    marginBottom: 16,
  },
  ratingInput: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  reviewInput: {
    height: 120,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    textAlignVertical: 'top',
    fontFamily: 'Inter_400Regular',
  },
  submitButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  existingReview: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
  },
  ratingDisplay: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 4,
  },
  reviewText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    lineHeight: 24,
  },
});