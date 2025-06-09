import { createDialogueHotspot } from '../dialogueManager.js';

// Sequence logic for image fade and dialogueManager
const imageSequence = [
  document.getElementById('sequence1'),
  document.getElementById('sequence2'),
  document.getElementById('sequence3'),
  document.getElementById('sequence4')
];

const oneNightDialogueSequence = [
  { textId: 'caption1', audioSrc: 'assets/optimized/oneNightStand1.mp3' },
  { textId: 'caption2', audioSrc: 'assets/optimized/oneNightStand2.mp3', delayBefore: 200 }
];

let hasPlayed = false;

function fadeImageSequence() {
  let idx = 0;
  function next() {
    if (idx < imageSequence.length - 1) {
      setTimeout(() => {
        imageSequence[idx].classList.remove('active');
        idx++;
        imageSequence[idx].classList.add('active');
        next();
      }, 2000);
    }
  }
  next();
}

const hotspot = document.getElementById('oneNightHotspot');
if (hotspot) {
  hotspot.addEventListener('mouseenter', () => {
    if (hasPlayed) return;
    hasPlayed = true;
    fadeImageSequence();
  });
}

// Attach the dialogue sequence to the hotspot
createDialogueHotspot('oneNightHotspot', oneNightDialogueSequence);

