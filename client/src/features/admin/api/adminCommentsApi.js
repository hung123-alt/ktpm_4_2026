import axiosClient from '../../../lib/axiosClient';

export const adminCommentsApi = {
  getAll: () => axiosClient.get('/comments'),
  remove: (id) => axiosClient.delete(`/comments/${id}`),
  toggleHide: (id) => axiosClient.patch(`/comments/${id}/hide`),

};