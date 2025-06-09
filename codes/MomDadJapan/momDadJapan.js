import { createDialogueHotspot } from '../dialogueManager.js';

// Only one hotspot for hospital scene
// Sequence: show FatherHospitalTextBox.png + play dad-hospital.wav, then MotherHospitalTextBox.png + play mom-hospital.wav

const dialogueSequence = [
  { textId: 'momSayCheese', audioSrc: 'assets/optimized/japan-firstPic-mom.wav' },
  { textId: 'dadAnswerCheese', audioSrc: 'assets/optimized/japan-firstPic-dad.wav', delayBefore: 200 }
];

createDialogueHotspot('springJapanHotspot', dialogueSequence, {
  backgroundSoundSrc: 'assets/optimized/birdChirp.mp3',
  backgroundSoundVolume: 1.0
});