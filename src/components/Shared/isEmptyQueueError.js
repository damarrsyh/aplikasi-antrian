export const isEmptyQueueError = (message) => {
  return /kosong|tidak ada/i.test(message);
};