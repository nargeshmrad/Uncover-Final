import { createDialogueHotspot } from '../dialogueManager.js';

// Only one hotspot for hospital scene
// Sequence: show FatherHospitalTextBox.png + play dad-hospital.wav, then MotherHospitalTextBox.png + play mom-hospital.wav

const dialogueSequence = [

  { textId: 'sushiDadImg', audioSrc: 'assets/optimized/sushi-dad.wav', delayBefore: 200 }
];

createDialogueHotspot('sushiHotspot', dialogueSequence);