// Query keys cho thông báo
export const notificationKeys = {
  all: ['notifications'],
  mine: () => [...notificationKeys.all, 'mine'],
};
