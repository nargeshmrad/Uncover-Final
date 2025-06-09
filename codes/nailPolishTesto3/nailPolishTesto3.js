/*-------------------------------------------------------------
 *  Nail‑Polish game logic (p5.js 1.9+)                     
 *-----------------------------------------------------------*/

// ---------- configuration ------------------------------------------------
const FINGER_BBOX = {
    x: 0.38,
    y: 0.38,
    w: 0.03, // smaller width
    h: 0.03,  // smaller height
  };
  const COMPLETE_THRESHOLD = 0.05;      // < 5 % pixels = finished
  
  // ---------- globals ------------------------------------------------------
  let bgImg, fingerImg, brushImg, padImg;
  let topLayer;               // finger overlay (erased by brush)
  let padLayer;               // for pad stage (optional extra grunge)
  let maskGfx;                // tiny off‑screen mask for progress test
  let fingerRect;             // pixel coords of current bbox
  let showPad      = false;   // stage switch
  let pictureDiv;             // .picture dom node
  
  // ---------- preload ------------------------------------------------------
  function preload() {
    bgImg     = loadImage("assets/optimized/Nail PolishBack.png");
    fingerImg = loadImage("assets/optimized/finger1.png");
    brushImg  = loadImage("assets/optimized/nailBrush.png");
    padImg    = loadImage("assets/optimized/pad.png");
  }
  
  // ---------- setup & responsiveness --------------------------------------
  function setup() {
    pictureDiv = document.querySelector(".picture");
    const {w, h} = computeCanvasSize();
    let cnv = createCanvas(w, h, document.getElementById("gameCanvas"));
    cnv.parent(pictureDiv);
    initLayers(w, h);
    noCursor();
    // Ensure custom cursor is visible and at correct position
    const cursorEl = document.getElementById('cursor-img');
    if (cursorEl) {
      cursorEl.style.display = 'block';
      // Move cursor image with mouse
      document.addEventListener('mousemove', e => {
        cursorEl.style.left = e.clientX + 'px';
        cursorEl.style.top = e.clientY + 'px';
      });
    }

  }
  
  function windowResized() {
    const {w, h} = computeCanvasSize();
    resizeCanvas(w, h);
    initLayers(w, h);
  }
  
  function computeCanvasSize() {
    const rect = pictureDiv.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;    // picture div keeps 16/9 via CSS aspect‑ratio
    return {w, h};
  }
  
  function initLayers(w, h) {
    topLayer  = createGraphics(w, h);
    padLayer  = createGraphics(w, h);

    // Calculate width or height based on aspect ratio to avoid stretching
    let desiredW = FINGER_BBOX.w * w;
    let aspect = fingerImg.height / fingerImg.width;
    let desiredH = desiredW * aspect;

    fingerRect = {
      x: FINGER_BBOX.x * w,
      y: FINGER_BBOX.y * h,
      w: desiredW,
      h: desiredH
    };
    topLayer.image(fingerImg, fingerRect.x, fingerRect.y, fingerRect.w, fingerRect.h);

    // tiny 1:1 mask for fast checks
    maskGfx = createGraphics(fingerRect.w, fingerRect.h);
    maskGfx.image(fingerImg, 0, 0, fingerRect.w, fingerRect.h);
  }
  
  // ---------- main loop ----------------------------------------------------
  function draw() {
    // background ------------------------------------------------------------
    image(bgImg, 0, 0, width, height);
    
    // finger / pad layers ---------------------------------------------------
    image(topLayer, 0, 0);
    if (showPad) {
      image(padLayer, 0, 0);
    }
    
    // custom cursor ---------------------------------------------------------
    push();
    noStroke();
    if (!showPad) {
      image(brushImg, mouseX - 32, mouseY - 32, 64, 64);
    } else {
      image(padImg, mouseX - 48, mouseY - 48, 96, 96);
    }
    pop();
  }
  
  // ---------- input --------------------------------------------------------
  function mouseDragged() {
    const r = !showPad ? 45 : 60;       // brush vs pad radius
    if (!showPad) {
      eraseFingerAt(mouseX, mouseY, r, "circle");
    } else {
      applyStrokeShape(padLayer, mouseX, mouseY, r*2, "circle");
    }
  }
  
  function mouseReleased() {
    if (!showPad && fingerRemoved()) {
      console.log("finger1 removed");
      showPad = true;                   // change stage
    }
  }
  
  // ---------- helpers ------------------------------------------------------
  function applyStrokeShape(g, x, y, size, shape) {
    g.push();
    g.noStroke();
    g.erase();
    if (shape === "circle") {
      g.circle(x, y, size);
    } else {
      g.square(x - size/2, y - size/2, size);
    }
    g.noErase();
    g.pop();
  }
  
  function eraseFingerAt(x, y, size, shape) {
    applyStrokeShape(topLayer, x, y, size, shape);
    // check if inside bbox → erase mask too ------------------------------
    if (
      x >= fingerRect.x && x <= fingerRect.x + fingerRect.w &&
      y >= fingerRect.y && y <= fingerRect.y + fingerRect.h
    ) {
      applyStrokeShape(maskGfx, x - fingerRect.x, y - fingerRect.y, size, shape);
    }
  }
  
  function fingerRemoved() {
    const img = maskGfx.get();      // small → cheap
    img.loadPixels();
    const data = img.pixels;
    let opaque = 0;
    for (let i = 3; i < data.length; i += 32) {   // sample 1 / 8 pixels
      if (data[i] > 16) opaque++;                 // alpha channel
    }
    return opaque / (data.length / 32) < COMPLETE_THRESHOLD;
  }
  