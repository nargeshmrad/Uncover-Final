const scene = document.getElementById("colleagueScene");
const womanText = document.getElementById("womanText");
const manText = document.getElementById("manText");

const ambience = new Audio("assets/optimized/workAmbience.mp3");
ambience.loop = true;

const fireSad = new Audio("assets/optimized/FireSad.mp3");
fireSad.loop = true;
fireSad.volume = 0;

const womanVoice = new Audio("assets/optimized/colleagueWoman.wav");
const manVoice = new Audio("assets/optimized/colleagueMan.wav");

let hasPlayed = false;

scene.addEventListener("mouseenter", () => {
  if (!hasPlayed) {
    ambience.play();
    womanVoice.play();
    womanText.style.display = "block";

    womanVoice.addEventListener("ended", () => {
      womanText.style.display = "none";
      manVoice.play();
      manText.style.display = "block";
    });

    manVoice.addEventListener("ended", () => {
      manText.style.display = "none";
      // Show envelope after manVoice ends
      const envelopeImg = document.getElementById("envelopeImg");
      if (envelopeImg) {
        envelopeImg.src = "assets/optimized/envelope.png";
        envelopeImg.style.display = "block";
        envelopeImg.onclick = function() {
          const fireTextContainer = document.getElementById("fireTextContainer");
          const fireTextImg = document.getElementById("fireTextImg");
          if (envelopeImg.src.includes("envelope.png")) {
            envelopeImg.src = "assets/optimized/letter.png";
            if (fireTextContainer) fireTextContainer.style.display = "block";
            if (fireTextImg) {
              fireTextImg.src = "assets/optimized/fireText.png";
              fireTextImg.onmouseenter = function() {
                fireTextImg.src = "assets/optimized/fireTextEnglish.png";
              };
              fireTextImg.onmouseleave = function() {
                fireTextImg.src = "assets/optimized/fireText.png";
              };
            }
            // Fade out ambience, fade in fireSad
            fadeAudio(ambience, 1, 0, 1000);
            fireSad.currentTime = 0;
            fireSad.play();
            fadeAudio(fireSad, 0, 1, 4000);
          } else {
            envelopeImg.src = "assets/optimized/envelope.png";
            if (fireTextContainer) fireTextContainer.style.display = "none";
            // Fade in ambience, fade out fireSad
            fadeAudio(ambience, ambience.volume, 1, 1000);
            fadeAudio(fireSad, fireSad.volume, 0, 1000, () => { fireSad.pause(); fireSad.currentTime = 0; });
          }
        };
      }
    });

    hasPlayed = true;
  }
});

scene.addEventListener("mouseleave", () => {
  ambience.pause();
  ambience.currentTime = 0;

  // Reset everything
  womanVoice.pause();
  womanVoice.currentTime = 0;
  womanText.style.display = "none";

  manVoice.pause();
  manVoice.currentTime = 0;
  manText.style.display = "none";

  hasPlayed = false;
  // Hide and reset envelope on mouseleave
  const envelopeImg = document.getElementById("envelopeImg");
  if (envelopeImg) {
    envelopeImg.style.display = "none";
    envelopeImg.src = "assets/optimized/envelope.png";
    envelopeImg.onclick = null;
  }
  // Hide and reset fireTextContainer
  const fireTextContainer = document.getElementById("fireTextContainer");
  const fireTextImg = document.getElementById("fireTextImg");
  if (fireTextContainer) fireTextContainer.style.display = "none";
  if (fireTextImg) {
    fireTextImg.src = "assets/optimized/fireText.png";
    fireTextImg.onmouseenter = null;
    fireTextImg.onmouseleave = null;
  }
  // Reset audio: fade in ambience, fade out fireSad
  fadeAudio(ambience, ambience.volume, 1, 1000);
  fadeAudio(fireSad, fireSad.volume, 0, 1000, () => { fireSad.pause(); fireSad.currentTime = 0; });
});

// Utility function to fade audio
function fadeAudio(audio, from, to, duration, onComplete) {
  const steps = 20;
  const stepTime = duration / steps;
  let currentStep = 0;
  audio.volume = from;
  const diff = to - from;
  const interval = setInterval(() => {
    currentStep++;
    audio.volume = from + (diff * currentStep / steps);
    if (currentStep >= steps) {
      audio.volume = to;
      clearInterval(interval);
      if (onComplete) onComplete();
    }
  }, stepTime);
}

