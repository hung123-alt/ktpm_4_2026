// Query keys cho bình luận — nhóm theo từng phim
export const commentKeys = {
  all: ['comments'],
  byMovie: (movieId) => [...commentKeys.all, 'movie', movieId],
};
