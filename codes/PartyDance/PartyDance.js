import { createDialogueHotspot } from '../dialogueManager.js';

// Responsive party overlay
const partyTextImg = document.getElementById('partyTextImg');

const partyHotspotDialogues = [
  {
    textId: 'partyTextImg',
    audioSrc: 'assets/optimized/partyRaha.wav'
  }
];

createDialogueHotspot(
  'partyHotspot',
  partyHotspotDialogues,
  {
    backgroundSoundSrc: 'assets/optimized/partyBackground.mp3',
    backgroundSoundVolume: 1.0
  }
);