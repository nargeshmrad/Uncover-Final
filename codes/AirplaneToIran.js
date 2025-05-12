const hotspot = document.getElementById('hotspot');
const ambienceAudio = document.getElementById('ambienceAudio');
const dialogAudio = document.getElementById('dialogAudio');

const text1 = document.getElementById('text1');
const text2 = document.getElementById('text2');
const text3 = document.getElementById('text3');
const text4 = document.getElementById('text4');

let sequenceActive = false;

hotspot.addEventListener('mouseenter', () => {
  if (sequenceActive) return;
  sequenceActive = true;

  // Start ambience immediately
  ambienceAudio.currentTime = 0;
  ambienceAudio.play();

  // Delay dialogAudio start by 1000ms (1 sec)
  setTimeout(() => {
    dialogAudio.currentTime = 0;
    dialogAudio.play();
  }, 1000);

  // Control how long each text stays (ms)
  const timings = [
    { element: text1, duration: 9000 },
    { element: text2, duration: 5000 },
    { element: text3, duration: 4000 },
    { element: text4, duration: 8000 },
  ];

  let currentIndex = 0;

  function showNext() {
    if (currentIndex > 0) {
      timings[currentIndex - 1].element.style.opacity = 0;
    }

    if (currentIndex < timings.length) {
      const { element, duration } = timings[currentIndex];
      element.style.opacity = 1;
      setTimeout(showNext, duration);
      currentIndex++;
    }
  }

  // Delay showing the first text by 1500ms (1.5 sec)
  setTimeout(showNext, 3000);
});

hotspot.addEventListener('mouseleave', () => {
  ambienceAudio.pause();
  ambienceAudio.currentTime = 0;
  dialogAudio.pause();
  dialogAudio.currentTime = 0;

  [text1, text2, text3, text4].forEach(text => text.style.opacity = 0);
  sequenceActive = false;
});
