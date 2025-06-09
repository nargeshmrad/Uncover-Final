import { createDialogueHotspot } from '../dialogueManager.js';

console.log('goodbyeHanna.js loaded');
const goodbyeHotspot = document.getElementById('goodbyeHotspot');
const rahaSayBye = document.getElementById('rahaSayBye');
const hanaAnswer = document.getElementById('hanaAnswer');
console.log('goodbyeHotspot:', goodbyeHotspot);
console.log('rahaSayBye:', rahaSayBye);
console.log('hanaAnswer:', hanaAnswer);

const dialogueSequence = [
  { textId: 'rahaSayBye', audioSrc: 'assets/optimized/goodbye-raha.wav' },
  { textId: 'hanaAnswer', audioSrc: 'assets/optimized/goodbye-hanna.wav', delayBefore: 200 }
];

createDialogueHotspot('goodbyeHotspot', dialogueSequence);
console.log('createDialogueHotspot called for goodbyeHotspot');
