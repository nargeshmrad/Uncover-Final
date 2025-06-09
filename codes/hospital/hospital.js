import { createDialogueHotspot } from '../dialogueManager.js';

// Only one hotspot for hospital scene
// Sequence: show FatherHospitalTextBox.png + play dad-hospital.wav, then MotherHospitalTextBox.png + play mom-hospital.wav

const dialogueSequence = [
  { textId: 'fatherTextBox', audioSrc: 'assets/optimized/dad-hospital.wav' },
  { textId: 'motherTextBox', audioSrc: 'assets/optimized/mom-hospital.wav', delayBefore: 200 }
];

createDialogueHotspot('highHotspot', dialogueSequence);