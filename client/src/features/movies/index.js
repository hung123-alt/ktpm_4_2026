// ============================================================
// Cửa export công khai của feature movies.
// ============================================================
export { moviesApi } from './api/moviesApi';
export { movieKeys } from './queries';
export { useMovies } from './hooks/useMovies';
export { useMovieDetail } from './hooks/useMovieDetail';
export { useMovieFilter } from './hooks/useMovieFilter';
export { useRandomMovie } from './hooks/useRandomMovie';
export { useRandomAdvanced } from './hooks/useRandomAdvanced';
export {
  useCreateMovie,
  useUpdateMovie,
  useDeleteMovie,
} from './hooks/useMovieMutations';
