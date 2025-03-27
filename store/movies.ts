import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Movie, Review } from '@/types/tmdb';

interface MovieStore {
  favorites: Movie[];
  reviews: Review[];
  addFavorite: (movie: Movie) => void;
  removeFavorite: (movieId: number) => void;
  addReview: (review: Review) => void;
  loadFavorites: () => Promise<void>;
  loadReviews: () => Promise<void>;
}

export const useMovieStore = create<MovieStore>((set) => ({
  favorites: [],
  reviews: [],
  addFavorite: (movie) =>
    set((state) => {
      const newFavorites = [...state.favorites, movie];
      AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      return { favorites: newFavorites };
    }),
  removeFavorite: (movieId) =>
    set((state) => {
      const newFavorites = state.favorites.filter((m) => m.id !== movieId);
      AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      return { favorites: newFavorites };
    }),
  addReview: (review) =>
    set((state) => {
      const newReviews = [...state.reviews, review];
      AsyncStorage.setItem('reviews', JSON.stringify(newReviews));
      return { reviews: newReviews };
    }),
  loadFavorites: async () => {
    const stored = await AsyncStorage.getItem('favorites');
    if (stored) {
      set({ favorites: JSON.parse(stored) });
    }
  },
  loadReviews: async () => {
    const stored = await AsyncStorage.getItem('reviews');
    if (stored) {
      set({ reviews: JSON.parse(stored) });
    }
  },
}));