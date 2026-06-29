// ============================================================
// Cửa export công khai của feature interactions.
// ============================================================
export { favoritesApi } from './api/favoritesApi';
export { watchlistApi } from './api/watchlistApi';
export { ratingsApi } from './api/ratingsApi';
export { watchHistoryApi } from './api/watchHistoryApi';

export {
  favoriteKeys,
  watchlistKeys,
  watchHistoryKeys,
  ratingKeys,
} from './queries';

export { useFavorites, useToggleFavorite } from './hooks/useFavorites';
export { useWatchlist, useToggleWatchlist } from './hooks/useWatchlist';
export {
  useWatchHistory,
  useSaveProgress,
  useRemoveHistory,
  useClearHistory,
} from './hooks/useWatchHistory';
export { useMyRating, useRateMovie } from './hooks/useRating';
