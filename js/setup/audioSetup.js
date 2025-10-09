export const audioSetup = () => {
  const audio = new Audio();
  audio.src = "assets/ChariotsofFire_Soundtrack.mp3";
  audio.loop = true;
  audio.volume = 0.2;

  let isPlaying = false;

  const audioUI = document.createElement("div");
  audioUI.style.cssText = `
    position: absolute;
    bottom: 1rem;
    left: 50vw;
    transform: translateX(-50%);
    color: white;
    font-family: Arial, sans-serif;
    font-size: 1rem;
    z-index: 10;
  `;

  const updateUI = () => {
    audioUI.textContent = isPlaying
      ? "Click to pause music"
      : "Click to play music";
  };

  updateUI();

  const toggleAudio = async () => {
    try {
      if (isPlaying) {
        audio.pause();
        isPlaying = false;
      } else {
        await audio.play();
        isPlaying = true;
      }
      updateUI();
    } catch (error) {
      console.log("Audio toggle failed:", error);
    }
  };

  document.addEventListener("click", toggleAudio);
  document.body.appendChild(audioUI);

  return { audio, toggle: toggleAudio };
};
