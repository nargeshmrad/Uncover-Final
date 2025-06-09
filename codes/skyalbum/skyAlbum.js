import { createDialogueHotspot } from '../dialogueManager.js';

const highHotspot = document.getElementById('highHotspot');
const lowHotspot = document.getElementById('lowHotspot');

const skyText1 = document.getElementById('skyText1');
const skyText2 = document.getElementById('skyText2');
const skyText3 = document.getElementById('skyText3');
const askMomText = document.getElementById('askMomText');
const momAnswerText = document.getElementById('momAnswerText');

const highHotspotDialogues = [
  { textId: 'skyText1', audioSrc: 'assets/optimized/sky1.mp3' },
  { textId: 'skyText2', audioSrc: 'assets/optimized/sky2.mp3', delayBefore: 200 },
  { textId: 'skyText3', audioSrc: 'assets/optimized/sky3.mp3', delayBefore: 200 }
];

const lowHotspotDialogues = [
  {
    textId: 'askMomText',
    audioSrc: 'assets/optimized/AskMomPoem.mp3',
    delayAfter: 900
  },
  {
    textId: 'momAnswerText',
    audioSrc: 'assets/optimized/sky-mom.mp3'
  }
];

createDialogueHotspot('highHotspot', highHotspotDialogues);

// The 'createDialogueHotspot' function now accepts an optional third argument for options.
createDialogueHotspot(
  'lowHotspot', 
  lowHotspotDialogues,
  // --- EXAMPLE: How to add a background sound ---
  // To use this, uncomment the object below and replace the file path.
  /* 
  {
    backgroundSoundSrc: 'assets/optimized/gentle-wind.m4a',
    backgroundSoundVolume: 0.4 // Optional, defaults to 1.0
  }
  */
);