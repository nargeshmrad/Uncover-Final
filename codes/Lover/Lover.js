import { createDialogueHotspot } from '../dialogueManager.js';

// Responsive party overlay
const loveTextImg1 = document.getElementById('loveTextImg1');
const loveTextImg2 = document.getElementById('loveTextImg2');
const loveHotspotDialogues = [
    {
      textId: 'loveTextImg1',
      audioSrc: 'assets/optimized/loveRaha1.wav'
    },
    {
      textId: 'loveTextImg2',
      audioSrc: 'assets/optimized/loveRaha2.wav'
    }
  ];

createDialogueHotspot(
  'loveHotspot',
  loveHotspotDialogues,
  {
    backgroundSoundSrc: 'assets/optimized/partyBackground.mp3',
    backgroundSoundVolume: 1.0
  }
);