const interactionArea = document.getElementById('interactionArea');
const protestImage = document.getElementById('protestImage');
const protestAudio = document.getElementById('protestAudio');

const imageSequence = [
  "assets/optimized/protest1.png",
  "assets/optimized/protest2.png",
  "assets/optimized/protest3.png",
  "assets/optimized/protest4.png"
];

const changeDelay = 1200; // 2 seconds between images
let sequenceTimeout = null;
let fadeTimeout = null;
let index = 0;

function resetSequence() {
  if (sequenceTimeout) clearTimeout(sequenceTimeout);
  if (fadeTimeout) clearTimeout(fadeTimeout);
  index = 0;
  protestImage.src = imageSequence[0];
  protestImage.classList.remove('fade-out');
}

function startSequence() {
  function next() {
    if (index >= imageSequence.length - 1) return;
    protestImage.classList.add('fade-out');
    fadeTimeout = setTimeout(() => {
      index++;
      protestImage.src = imageSequence[index];
      protestImage.classList.remove('fade-out');
      sequenceTimeout = setTimeout(next, changeDelay);
    }, 600); // fade duration
  }
  sequenceTimeout = setTimeout(next, changeDelay);
}

protestImage.addEventListener('mouseenter', () => {
  resetSequence();
  startSequence();
  protestAudio.currentTime = 0;
  protestAudio.play();
});

protestImage.addEventListener('mouseleave', () => {
  resetSequence();
  protestAudio.pause();
  protestAudio.currentTime = 0;
});