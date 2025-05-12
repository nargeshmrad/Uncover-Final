const greenHotspot = document.getElementById('greenHotspot');
const redHotspot = document.getElementById('redHotspot');

const grandpaAudio = document.getElementById('grandpaAudio');
const grandpaBgMusic = document.getElementById('grandpaBgMusic');
const momAudio1 = document.getElementById('momAudio1');
const momAudio2 = document.getElementById('momAudio2');
const airportIranMusic = document.getElementById('airportIranMusic');

const grandpaText = document.getElementById('grandpaText');
const momText1 = document.getElementById('momText1');
const momText2 = document.getElementById('momText2');

// Green Hotspot Logic (Grandpa)
greenHotspot.addEventListener('mouseenter', () => {
  grandpaAudio.currentTime = 0;
  grandpaAudio.play();
  grandpaBgMusic.currentTime = 0;
  grandpaBgMusic.play();
  grandpaText.style.opacity = 1;
});

greenHotspot.addEventListener('mouseleave', () => {
  grandpaAudio.pause();
  grandpaAudio.currentTime = 0;
  grandpaBgMusic.pause();
  grandpaBgMusic.currentTime = 0;
  grandpaText.style.opacity = 0;
});

// Red Hotspot Logic (Mom Sequence)
let redSequenceActive = false;

redHotspot.addEventListener('mouseenter', () => {
  if (redSequenceActive) return;
  redSequenceActive = true;

  momText1.style.opacity = 1;
  momAudio1.currentTime = 0;
  momAudio1.play();
  airportIranMusic.currentTime = 0;
  airportIranMusic.play();

  momAudio1.onended = () => {
    momText1.style.opacity = 0;
    momText2.style.opacity = 1;
    momAudio2.currentTime = 0;
    momAudio2.play();

    momAudio2.onended = () => {
      momText2.style.opacity = 0;
      redSequenceActive = false;
    };
  };
});

redHotspot.addEventListener('mouseleave', () => {
  momAudio1.pause();
  momAudio2.pause();
  airportIranMusic.pause();
  momText1.style.opacity = 0;
  momText2.style.opacity = 0;
  redSequenceActive = false;
});
