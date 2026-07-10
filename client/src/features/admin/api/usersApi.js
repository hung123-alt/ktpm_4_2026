import axiosClient from '../../../lib/axiosClient';

export const usersApi = {
  getAll: () => axiosClient.get('/users'),
  toggleBan: (id) => axiosClient.patch(`/users/${id}/ban`),
  remove: (id) => axiosClient.delete(`/users/${id}`),
};