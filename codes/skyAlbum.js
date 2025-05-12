const highHotspot = document.getElementById('highHotspot');
const lowHotspot = document.getElementById('lowHotspot');

const skyAudio = document.getElementById('skyAudio');
const askMomAudio = document.getElementById('askMomAudio');
const momAnswerAudio = document.getElementById('momAnswerAudio');

const skyText1 = document.getElementById('skyText1');
const skyText2 = document.getElementById('skyText2');
const skyText3 = document.getElementById('skyText3');
const askMomText = document.getElementById('askMomText');
const momAnswerText = document.getElementById('momAnswerText');

let highSequenceActive = false;
let lowSequenceActive = false;

// High Hotspot Sequence: Sky Audio with Sequential Texts
highHotspot.addEventListener('mouseenter', () => {
  if (highSequenceActive) return;
  highSequenceActive = true;

  skyAudio.currentTime = 0;
  skyAudio.play();

  skyText1.style.opacity = 1;
  setTimeout(() => {
    skyText1.style.opacity = 0;
    skyText2.style.opacity = 1;
  }, 8000);

  setTimeout(() => {
    skyText2.style.opacity = 0;
    skyText3.style.opacity = 1;
  }, 16000);

  skyAudio.onended = () => {
    skyText3.style.opacity = 0;
    highSequenceActive = false;
  };
});

// Low Hotspot Sequence: Ask Mom Poem and Answer
lowHotspot.addEventListener('mouseenter', () => {
  if (lowSequenceActive) return;
  lowSequenceActive = true;

  askMomAudio.currentTime = 0;
  askMomAudio.play();
  askMomText.style.opacity = 1;

  askMomAudio.onended = () => {
    askMomText.style.opacity = 0;
    momAnswerAudio.currentTime = 0;
    momAnswerAudio.play();
    momAnswerText.style.opacity = 1;

    momAnswerAudio.onended = () => {
      momAnswerText.style.opacity = 0;
      lowSequenceActive = false;
    };
  };
});

// Reset All on Mouse Leave
function resetAll() {
  [skyAudio, askMomAudio, momAnswerAudio].forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
  [skyText1, skyText2, skyText3, askMomText, momAnswerText].forEach(text => {
    text.style.opacity = 0;
  });
  highSequenceActive = false;
  lowSequenceActive = false;
}

highHotspot.addEventListener('mouseleave', resetAll);
lowHotspot.addEventListener('mouseleave', resetAll);
