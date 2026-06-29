// ============================================================
// Query keys cho nhóm interactions (yêu thích, xem sau, lịch sử, đánh giá).
// Mỗi loại 1 nhánh key riêng để invalidate độc lập.
// ============================================================
export const favoriteKeys = {
  all: ['favorites'],
  mine: () => [...favoriteKeys.all, 'mine'],
};

export const watchlistKeys = {
  all: ['watchlist'],
  mine: () => [...watchlistKeys.all, 'mine'],
};

export const watchHistoryKeys = {
  all: ['watch-history'],
  mine: () => [...watchHistoryKeys.all, 'mine'],
};

export const ratingKeys = {
  all: ['ratings'],
  myRating: (movieId) => [...ratingKeys.all, 'mine', movieId],
};
