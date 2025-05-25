let bgImg;
let baseDeformRadius = 40; // Base size of spiral effect
let baseSpiralStrength = 0.3; // Base spiral twist
let deformRadius = baseDeformRadius;
let spiralStrength = baseSpiralStrength;

function preload() {
  bgImg = loadImage('../assets/EyeShadowScene/EyeShadowScene.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
}

function draw() {
  clear();
  image(bgImg, 0, 0, width, height);

  // Add randomness to spiral radius and strength based on cursor and time
  let t = millis() * 0.0005;
  let nx = mouseX * 0.01;
  let ny = mouseY * 0.01;
  deformRadius = baseDeformRadius + 50 * noise(nx + t, ny); // Range now 40 to 160 (1x to 3x+ base)
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
}