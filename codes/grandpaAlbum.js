const greenHotspot = document.getElementById('greenHotspot');
const redHotspot = document.getElementById('redHotspot');
const lullabyAudio = document.getElementById('lullabyAudio');
const voice1Audio = document.getElementById('voice1Audio');
const voice2Audio = document.getElementById('voice2Audio');
const grandpaText1 = document.getElementById('grandpaText1');
const grandpaText2 = document.getElementById('grandpaText2');

// Green Hotspot (Lullaby) Logic
greenHotspot.addEventListener('mouseenter', () => {
  lullabyAudio.volume = 1;
  lullabyAudio.play();
});

greenHotspot.addEventListener('mouseleave', () => {
  const fadeOut = setInterval(() => {
    if (lullabyAudio.volume > 0.05) {
      lullabyAudio.volume -= 0.05;
    } else {
      lullabyAudio.pause();
      lullabyAudio.currentTime = 0;
      lullabyAudio.volume = 1;
      clearInterval(fadeOut);
    }
  }, 100);
});

// Red Hotspot (Voices and Texts) Logic
let redSequenceActive = false;

redHotspot.addEventListener('mouseenter', () => {
  if (redSequenceActive) return;
  redSequenceActive = true;

  grandpaText1.style.opacity = 1;
  voice1Audio.currentTime = 0;
  voice1Audio.play();

  voice1Audio.onended = () => {
    grandpaText1.style.opacity = 0;
    grandpaText2.style.opacity = 1;
    voice2Audio.currentTime = 0;
    voice2Audio.play();

    voice2Audio.onended = () => {
      grandpaText2.style.opacity = 0;
      redSequenceActive = false;
    };
  };
});

redHotspot.addEventListener('mouseleave', () => {
  voice1Audio.pause();
  voice2Audio.pause();
  voice1Audio.currentTime = 0;
  voice2Audio.currentTime = 0;
  grandpaText1.style.opacity = 0;
  grandpaText2.style.opacity = 0;
  redSequenceActive = false;
});
