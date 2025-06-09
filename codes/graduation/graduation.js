import { createDialogueHotspot } from '../dialogueManager.js';

console.log('graduation.js loaded');
const momHotspot = document.getElementById('momHotspot');
const momCaption = document.getElementById('momCaption');
console.log('momHotspot:', momHotspot);
console.log('momCaption:', momCaption);

const dialogueSequence = [
  { textId: 'momCaption', audioSrc: 'assets/optimized/graduation-mom.wav' }
];

createDialogueHotspot('momHotspot', dialogueSequence);
console.log('createDialogueHotspot called for momHotspot');

