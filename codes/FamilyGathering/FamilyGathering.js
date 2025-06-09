const tarHotspot = document.getElementById("tarHotspot");
const danceHotspot = document.getElementById("danceHotspot");

const tarAudio = new Audio("assets/optimized/gatheringTar.mp3");
const danceAudio = new Audio("assets/optimized/dance.mp3");

function stopAllAudio() {
  tarAudio.pause();
  tarAudio.currentTime = 0;
  danceAudio.pause();
  danceAudio.currentTime = 0;
}

tarHotspot.addEventListener("mouseenter", () => {
  stopAllAudio();
  tarAudio.play();
});

danceHotspot.addEventListener("mouseenter", () => {
  stopAllAudio();
  danceAudio.play();
});

tarHotspot.addEventListener("mouseleave", () => {
  tarAudio.pause();
  tarAudio.currentTime = 0;
});

danceHotspot.addEventListener("mouseleave", () => {
  danceAudio.pause();
  danceAudio.currentTime = 0;
});
