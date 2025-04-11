export const playQueueAudio = async (sequence) => {
  for (let audioUrl of sequence) {
    const audio = new Audio(audioUrl);
    await new Promise((resolve) => {
      audio.onended = resolve;
      audio.play();
    });
  }
};
