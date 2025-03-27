const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Using demo API key for development - in production, use environment variables
const API_KEY = '2dca580c2a14b55200e784d157207b4d';

export const getImageUrl = (path: string, size: 'w500' | 'original' = 'w500') =>
  `${TMDB_IMAGE_BASE_URL}/${size}${path}`;

export const searchMovies = async (query: string, page = 1) => {
  const response = await fetch(
    `${TMDB_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}&page=${page}`
  );
  return response.json();
};

export const getPopularMovies = async (page = 1) => {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
  );
  return response.json();
};

export const getMovieDetails = async (id: number) => {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${id}?api_key=${API_KEY}`
  );
  return response.json();
};