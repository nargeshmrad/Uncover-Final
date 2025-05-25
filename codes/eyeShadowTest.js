let brushImg;
let brushOpacity = 255;
let brushActive = false;
let activeColor = null; // 'pink', 'yellow', or 'green'

// Ripple effect parameters
let cols = 100; // Reduced resolution for better performance
let rows = 100;
let current;
let previous;
let dampening = 0.99;
let rippleGraphics;
let isRippling = false;
let lastRippleTime = 0;
const rippleInterval = 50; // Minimum time between ripples

let hotspotRed, hotspotGreen, hotspotWhite;
let pinkEyeshadow, yellowEyeshadow, greenEyeshadow;
let audio;

let bgImg;
let fgImg;
let baseDeformRadius = 40; // Base size of spiral effect
let baseSpiralStrength = 0.3; // Base spiral twist
let deformRadius = baseDeformRadius;
let spiralStrength = baseSpiralStrength;

function preload() {
  brushImg = loadImage('../assets/EyeShadowScene/brush.png');
  bgImg = loadImage('../assets/EyeShadowScene/EyeShadowScene.png');
  fgImg = loadImage('../assets/EyeShadowScene/EyeShadowScene2.png');
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight, { willReadFrequently: true });
  noCursor();
  pixelDensity(1);

  // Initialize ripple effect
  rippleGraphics = createGraphics(cols, rows, { willReadFrequently: true });
  rippleGraphics.pixelDensity(1);
  current = new Array(cols * rows).fill(0);
  previous = new Array(cols * rows).fill(0);

  hotspotRed = document.getElementById('hotspotRed');
  hotspotGreen = document.getElementById('hotspotGreen');
  hotspotWhite = document.getElementById('hotspotWhite');

  pinkEyeshadow = document.getElementById('pinkEyeshadow');
  yellowEyeshadow = document.getElementById('yellowEyeshadow');
  greenEyeshadow = document.getElementById('greenEyeshadow');

  // Hide all eyeshadows initially
  pinkEyeshadow.style.opacity = 0;
  yellowEyeshadow.style.opacity = 0;
  greenEyeshadow.style.opacity = 0;

  // Show/hide eyeshadow on hotspot hover
  hotspotRed.addEventListener('mouseenter', () => { pinkEyeshadow.style.opacity = 1; });
  hotspotRed.addEventListener('mouseleave', () => { pinkEyeshadow.style.opacity = 0; });
  hotspotGreen.addEventListener('mouseenter', () => { greenEyeshadow.style.opacity = 1; });
  hotspotGreen.addEventListener('mouseleave', () => { greenEyeshadow.style.opacity = 0; });
  hotspotWhite.addEventListener('mouseenter', () => { yellowEyeshadow.style.opacity = 1; });
  hotspotWhite.addEventListener('mouseleave', () => { yellowEyeshadow.style.opacity = 0; });

  audio = document.getElementById('eyeShadowAudio');
  audio.loop = true;
  audio.volume = 0.5;
  audio.play().catch(() => { /* Autoplay might be blocked */ });

  // Event listeners for hotspots
  hotspotGreen.addEventListener('click', () => revealEyeshadow('pink'));
  hotspotRed.addEventListener('click', () => revealEyeshadow('yellow'));
  hotspotWhite.addEventListener('click', () => revealEyeshadow('green'));

  [hotspotGreen, hotspotRed, hotspotWhite].forEach(hotspot => {
    hotspot.addEventListener('mouseenter', () => {
      if (!brushActive) document.body.style.cursor = 'pointer';
    });
    hotspot.addEventListener('mouseleave', () => {
      document.body.style.cursor = 'none';
    });
  });


}



function draw() {
  clear();
  // Draw and deform background image
  image(bgImg, 0, 0, width, height);

  // Add randomness to spiral radius and strength based on cursor and time
  let t = millis() * 0.0005;
  let nx = mouseX * 0.01;
  let ny = mouseY * 0.01;
  deformRadius = baseDeformRadius + 50 * noise(nx + t, ny); // Range now 40 to 90
  spiralStrength = baseSpiralStrength + 0.25 * (noise(nx, ny + t) - 0.5);

  // Arty spiral deformation under cursor
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
    bgImg.loadPixels();
    loadPixels();
    let mx = mouseX;
    let my = mouseY;
    let pr = deformRadius * (bgImg.width / width);
    let px = floor(mx * (bgImg.width / width));
    let py = floor(my * (bgImg.height / height));
    for (let dy = -pr; dy <= pr; dy++) {
      for (let dx = -pr; dx <= pr; dx++) {
        let dist = sqrt(dx * dx + dy * dy);
        if (dist < pr) {
          // Spiral: angle offset increases as you get closer to center
          let angle = atan2(dy, dx) + spiralStrength * (1 - dist / pr) * TWO_PI;
          let radius = dist;
          let sx = floor(px + cos(angle) * radius);
          let sy = floor(py + sin(angle) * radius);
          let tx = px + dx;
          let ty = py + dy;
          if (sx >= 0 && sx < bgImg.width && sy >= 0 && sy < bgImg.height &&
              tx >= 0 && tx < bgImg.width && ty >= 0 && ty < bgImg.height) {
            let srcIdx = 4 * (sx + sy * bgImg.width);
            let tgtIdx = 4 * (floor(tx * (width / bgImg.width)) + floor(ty * (height / bgImg.height)) * width);
            // Color mixing: blend original and deformed for arty look
            for (let c = 0; c < 3; c++) {
              let orig = pixels[tgtIdx + c];
              let spiral = bgImg.pixels[srcIdx + c];
              pixels[tgtIdx + c] = lerp(orig, spiral, 0.7); // 0.7 = more spiral, 0 = original
            }
            pixels[tgtIdx + 3] = 255;
          }
        }
      }
    }
    updatePixels();
  }

  // Draw foreground image above background, below eyeshadows (which are HTML)
  if (fgImg) {
    image(fgImg, 0, 0, width, height);
  }
  // Eyeshadow images are HTML elements and will always be on top due to z-index.


  // Update ripple effect
  if (isRippling) {
    // Calculate water ripple effect
    for (let i = 1; i < cols - 1; i++) {
      for (let j = 1; j < rows - 1; j++) {
        let index = i + j * cols;
        current[index] = (
          previous[index - 1] +
          previous[index + 1] +
          previous[index - cols] +
          previous[index + cols]
        ) / 2 - current[index];
        current[index] *= dampening;
      }
    }

    // Draw ripple effect
    rippleGraphics.loadPixels();
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let index = i + j * cols;
        let d = current[index];
        let brightness = constrain(128 + d * 2, 0, 255);
        
        rippleGraphics.pixels[index * 4 + 0] = brightness;
        rippleGraphics.pixels[index * 4 + 1] = brightness;
        rippleGraphics.pixels[index * 4 + 2] = brightness;
        rippleGraphics.pixels[index * 4 + 3] = 100; // Semi-transparent
      }
    }
    rippleGraphics.updatePixels();

    // Swap buffers
    let temp = previous;
    previous = current;
    current = temp;
  }

  // Draw the ripple effect only (no palette)
  if (isRippling) {
    push();
    blendMode(OVERLAY);
    image(rippleGraphics, 0, 0, width, height); // Stretch to canvas
    blendMode(BLEND);
    pop();
  }

  // Always draw brush cursor last so it's on top of everything
  if (brushImg) {
    push();
    translate(mouseX, mouseY);
    imageMode(CENTER);
    tint(255, brushOpacity);
    image(brushImg, 0, 0, 100, 100);
    pop();
  }
}

function isOverElement(el) {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  return mouseX >= rect.left &&
         mouseX <= rect.right &&
         mouseY >= rect.top &&
         mouseY <= rect.bottom;
}



function addRipple(x, y) {
  if (ripples.length >= maxRipples) ripples.shift();
  ripples.push({
    x,
    y,
    radius: 0,
    alpha: 255,
    life: rippleLifespan
  });
}

function revealEyeshadow(color) {
  if (brushActive && activeColor === color) return;

  if (activeColor) {
    const current = document.getElementById(activeColor + 'Eyeshadow');
    if (current) {
      current.style.opacity = '0';
      setTimeout(() => {
        current.style.display = 'none';
      }, 2000);
    }
  }

  brushActive = true;
  activeColor = color;

  brushOpacity = 355;
  setTimeout(() => { brushOpacity = 255; }, 200);

  const newShadow = document.getElementById(color + 'Eyeshadow');
  if (newShadow) {
    newShadow.style.display = 'block';
    newShadow.style.opacity = '0';
    newShadow.offsetHeight; // trigger reflow
    requestAnimationFrame(() => {
      newShadow.style.opacity = '1';
    });
  }
}