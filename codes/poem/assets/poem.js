// Dialogue logic for the Poem Hotspot

// IDs/classes for overlays and audios
const poemHotspot = document.querySelector('.hotspot');
const picture = document.querySelector('.picture');

// Create overlays (hidden by default)
const poemText1 = document.createElement('img');
poemText1.src = 'assets/optimized/poemText1.png';
poemText1.alt = 'Poem Text 1';
poemText1.className = 'poem-overlay';
poemText1.style.opacity = '0';
poemText1.style.display = 'none';
poemText1.style.pointerEvents = 'none';

const poemText2 = document.createElement('img');
poemText2.src = 'assets/optimized/poemText2.png';
poemText2.alt = 'Poem Text 2';
poemText2.className = 'poem-overlay';
poemText2.style.opacity = '0';
poemText2.style.display = 'none';
poemText2.style.pointerEvents = 'none';
// No position/top/left/width/zIndex JS styles, all handled by CSS

// Add overlays to .picture
picture.appendChild(poemText1);
picture.appendChild(poemText2);

// Create audios
const audio1 = new Audio('assets/optimized/music-raha1.wav');
const audio2 = new Audio('assets/optimized/music-raha2.wav');

let timeout1 = null;
let timeout2 = null;

function resetPoemHotspot() {
  poemText1.style.opacity = '0';
  poemText1.style.display = 'none';
  poemText2.style.opacity = '0';
  poemText2.style.display = 'none';
  audio1.pause(); audio1.currentTime = 0;
  audio2.pause(); audio2.currentTime = 0;
  if (timeout1) clearTimeout(timeout1);
  if (timeout2) clearTimeout(timeout2);
}

poemHotspot.addEventListener('mouseenter', () => {
  resetPoemHotspot();
  // Show first overlay and play first audio
  poemText1.style.display = 'block';
  poemText1.style.opacity = '1';
  audio1.play();
  timeout1 = setTimeout(() => {
    // Hide first, show second, play second audio
    poemText1.style.opacity = '0';
    poemText1.style.display = 'none';
    poemText2.style.display = 'block';
    poemText2.style.opacity = '1';
    audio2.play();
  }, Math.max(audio1.duration * 1000, 2000)); // fallback 2s if duration missing
});

poemHotspot.addEventListener('mouseleave', () => {
  resetPoemHotspot();
});

// Hide overlays on load
resetPoemHotspot();

// Optional: update overlay positions responsively on window resize
window.addEventListener('resize', () => {
  // overlays use % so should scale automatically
});
