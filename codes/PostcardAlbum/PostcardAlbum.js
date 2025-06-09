import { createDialogueHotspot } from '../dialogueManager.js';

console.log('PostcardAlbum.js loaded');
const shadowHotspot = document.getElementById('shadowHotspot');
const shadowText = document.getElementById('shadowText');
console.log('shadowHotspot:', shadowHotspot);
console.log('shadowText:', shadowText);

const dialogueSequence = [
  { textId: 'shadowText', audioSrc: 'assets/optimized/classroom-shadows.wav' }
];

createDialogueHotspot('shadowHotspot', dialogueSequence);
console.log('createDialogueHotspot called for shadowHotspot');

