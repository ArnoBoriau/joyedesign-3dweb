export const audioSetup = () => {
  const audio = new Audio();
  audio.src = "assets/ChariotsofFire_Soundtrack.mp3";
  audio.loop = true;
  audio.volume = 0.2;

  let isPlaying = false;

  const audioButton = document.createElement("button");
  audioButton.style.cssText = `
    position: absolute;
    bottom: 1rem;
    left: 50vw;
    transform: translateX(-50%);
    color: white;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 5px;
    padding: 8px 16px;
    font-family: Arial, sans-serif;
    font-size: 1rem;
    cursor: pointer;
    z-index: 10;
    transition: background-color 0.3s ease;
  `;

  // hover effect
  audioButton.addEventListener("mouseenter", () => {
    audioButton.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
  });

  audioButton.addEventListener("mouseleave", () => {
    audioButton.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  });

  const updateUI = () => {
    audioButton.textContent = isPlaying ? "Pause Music" : "Play Music";
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

  audioButton.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent event bubbling (OrbitControls)
    toggleAudio();
  });
  document.body.appendChild(audioButton);

  return { audio, toggle: toggleAudio, button: audioButton };
};
