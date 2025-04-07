export const playQueueAudio = async (audioUrls) => {
  for (const url of audioUrls) {
    await playAudio(url);
  }
};

const playAudio = (url) => {
  return new Promise((resolve) => {
    const audio = new Audio(url);
    audio.onended = resolve;
    audio.onerror = resolve; // supaya tidak hang kalau file error
    audio.play();
  });
};
