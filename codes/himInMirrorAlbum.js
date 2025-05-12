const hotspot = document.getElementById('hotspot');
const textbox = document.getElementById('textbox');
const mirrorDirtAudio = document.getElementById('mirrorDirtAudio');
const dreamVoiceAudio = document.getElementById('dreamVoiceAudio');
const sponge = document.getElementById('sponge');
const canvas = document.getElementById('dirtCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

// Load and draw dirt image
const dirtImage = new Image();
dirtImage.src = '../assets/HimInMirrorAlbum/DirtOnMirror.png';

// Resize canvas to match displayed size
function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  // Redraw dirt image after resizing
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(dirtImage, 0, 0, canvas.width, canvas.height);
}

// Redraw on image load and window resize
dirtImage.onload = () => {
  resizeCanvas();
};
window.addEventListener('resize', resizeCanvas);

let voiceTimer = null;
let resetTimer = null;
let activated = false;

// Main Interaction Triggered Once on First Hover
hotspot.addEventListener('mouseenter', () => {
  if (activated) return;
  activated = true;

  mirrorDirtAudio.currentTime = 0;
  mirrorDirtAudio.play();

  voiceTimer = setTimeout(() => {
    dreamVoiceAudio.currentTime = 0;
    dreamVoiceAudio.play();
    textbox.style.opacity = 1;

    resetTimer = setTimeout(() => {
      textbox.style.opacity = 0;
      sponge.style.display = 'block'; // Show sponge after dreamVoice finishes
    }, dreamVoiceAudio.duration * 1000);

  }, 2000);
});

// Sponge Dragging Logic
let isDraggingSponge = false;
let spongeOffsetX = 0;
let spongeOffsetY = 0;

sponge.addEventListener('mousedown', (e) => {
  isDraggingSponge = true;
  spongeOffsetX = e.offsetX;
  spongeOffsetY = e.offsetY;
  sponge.style.cursor = 'grabbing';
});

// Check if the canvas is fully erased (transparent)
function isCanvasEmpty() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] > 0) return false; // Non-transparent pixel found
  }
  return true;
}

document.addEventListener('mousemove', (e) => {
  if (isDraggingSponge) {
    const rect = sponge.parentElement.getBoundingClientRect();
    const newX = e.clientX - rect.left - spongeOffsetX;
    const newY = e.clientY - rect.top - spongeOffsetY;
    sponge.style.left = `${newX}px`;
    sponge.style.top = `${newY}px`;

    // Calculate position relative to canvas
    const canvasRect = canvas.getBoundingClientRect();
    const eraseX = e.clientX - canvasRect.left;
    const eraseY = e.clientY - canvasRect.top;

    if (eraseX >= 0 && eraseX <= canvasRect.width && eraseY >= 0 && eraseY <= canvasRect.height) {
      // Convert screen coordinates to canvas coordinates
      const canvasX = (eraseX / canvasRect.width) * canvas.width;
      const canvasY = (eraseY / canvasRect.height) * canvas.height;

      // Erase circular area
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, 20, 0, Math.PI * 2);
      ctx.fill();

      // Check if fully erased
      if (isCanvasEmpty()) {
        hotspot.classList.add('dirt-erased');
        sponge.style.display = 'none'; // Hide sponge when done
      }
    }
  }
});

window.addEventListener('mouseup', () => {
  if (isDraggingSponge) {
    isDraggingSponge = false;
    sponge.style.cursor = 'grab';
  }
});
