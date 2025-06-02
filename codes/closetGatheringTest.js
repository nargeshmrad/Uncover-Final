/******************************************************************************
 *  ClosetGathering – responsive edition (same logic, responsive coordinates) *
 *  identical scaling model to luggageScene.js                                *
 ******************************************************************************/

// ────────────────────────────────────────────────────────────────────────────
// 1.  CONSTANTS & GLOBAL SCALERS
// ────────────────────────────────────────────────────────────────────────────
const DESIGN_W  = 1920;            // design resolution used when coordinates
const DESIGN_H  = 1080;            // were pixel-perfected in Photoshop
const BASE_IMG_SCALE = 0.76;       // = previous “coef” in the fixed version

const DEBUG_MODE   = false;         // set to false for production

let currentScale = 1;              // run-time multiplier (DESIGN->SCREEN)
let canvasW      = DESIGN_W;       // updated every window resize
let canvasH      = DESIGN_H;

let currentlyDragged = null;       // sprite that is being dragged right now

// convenience helpers
const sc = v => v * currentScale;
const pos = (x, y) => ({ x: sc(x), y: sc(y) });

// ────────────────────────────────────────────────────────────────────────────
// 2.  ASSET VARIABLES  (unchanged – only regrouped)
// ────────────────────────────────────────────────────────────────────────────
let ClosetImg;
let socksInFeetImg, shirtBodyImg, shortPantOnBodyImg, OverallSelectedImg;
let socksSelectedImg, SocksClosetImg, shoesImg, foldedShortPantImg;
let foldedLongPantImg, ShirtHangedImg, topHangedImg, OverallInClosetImg;
let longPantImg, TopOnBodyImg;      

// SOUND
let bgMusic, clothesSound, clothesDropSound,
    cropTopSound, shortPantSound, sneakersSound, overallRahaSound, longPantRahaSound, shirtRahaSound;

// SPRITES
let overall, longPants, socks, shortPants, shoes,
    shirt, topClothing;
let dropZone, foldedDropZone, socksWearZone, shirtWearZone,
    overallWearZone, shortPantsWearZone, shoesWearZone, topWearZone;

// STATE FLAGS
let isPantInDropZone = false,
    isSocksWorn      = false,
    isShirtWorn      = false;
    isShoesWorn      = false;

let topWornItem    = null;   // 'shirt' | 'top'   | 'overall' | null
let bottomWornItem = null;   // 'longPants' | 'shortPants' | 'overall' | null

const LAYOUT_SHIFT_X = 240;   // px to push everything right  (- value = left)
const LAYOUT_SHIFT_Y = 137;   // px to push everything down   (- value = up)
const LAYOUT_SCALE   = 1.25;   // 1 = original, 1.2 = 20% bigger, 0.8 = smaller

// ────────────────────────────────────────────────────────────────────────────
// 3.  DESIGN-SPACE POSITIONS & DIMENSIONS – NOTHING inside this block scales
// ────────────────────────────────────────────────────────────────────────────
const D = {                   // (D = design)
  /* originals (taken from old code) */
  shirt:          { x: 318, y: 218,  w: 50, h: 150 },
  longPantsFolded:{ x: 500, y: 435,  w: 70, h: 50 },
  socks:          { x: 319, y: 478,  w:  80, h:  60 },
  overall:        { x: 497, y: 247,  w: 90, h: 180 },
  shortPant:      { x: 505, y: 490,  w: 70, h: 50 },
  shoes:          { x: 319, y: 560,  w: 80, h: 60 },
  top:            { x: 372, y: 211,  w: 50, h: 150 },

  /* WEAR / DROP zones (exact pixels on 1920 × 1080 PSD) */
  dropZone:           { x: 747, y: 411, w: 144, h: 297 },
  foldedDropZone:     { x: 500, y: 435, w: 144, h: 297 },
  socksWearZone:      { x: 747, y: 515, w: 100, h:  50 },
  shirtWearZone:      { x: 748, y: 293, w: 100, h: 150 },
  overallWearZone:    { x: 748, y: 307, w: 100, h: 200 },
  shortPantsWearZone: { x: 749, y: 359, w: 100, h: 150 },
  shoesWearZone:      { x: 749, y: 514, w: 100, h:  50 },
  topWearZone:        { x: 748, y: 264, w: 100, h: 150 }
};

for (const key in D) {
    const r = D[key];
    r.x = r.x * LAYOUT_SCALE + LAYOUT_SHIFT_X;
    r.y = r.y * LAYOUT_SCALE + LAYOUT_SHIFT_Y;
    r.w = r.w * LAYOUT_SCALE;
    r.h = r.h * LAYOUT_SCALE;
}

// distance thresholds in DESIGN space
const TH = {
  closeWear    : 50,
  closeSocks   : 30,
  magnetPants  : 100
};

// ────────────────────────────────────────────────────────────────────────────
// 4.  PRELOAD  (unchanged except removal of *coef* multiplication;
//               we keep BASE_IMG_SCALE as design-space constant)
// ────────────────────────────────────────────────────────────────────────────
function preload() {
  //  █  sounds
  cropTopSound     = loadSound('assets/optimized/cropTop-raha.wav');
  shortPantSound   = loadSound('assets/optimized/shortPant-raha.wav');
  sneakersSound    = loadSound('assets/optimized/sneakers-raha.wav');
  clothesSound     = loadSound('assets/optimized/clothesMovement.mp3');
  clothesDropSound = loadSound('assets/optimized/clothesDrop.mp3');
  bgMusic          = loadSound('assets/optimized/ClosetAmbience.mp3');
  overallRahaSound = loadSound('assets/optimized/overall-raha.wav');
  longPantRahaSound = loadSound('assets/optimized/longPant-raha.wav');
  shirtRahaSound = loadSound('assets/optimized/shirt-raha.wav');

  //  █  visuals – identical list as original file
  ClosetImg            = loadImage('assets/optimized/Closet.png');
  socksInFeetImg       = loadImage('assets/optimized/socksInFeet.png');
  shoesImg             = loadImage('assets/optimized/shoes.png');
  topHangedImg         = loadImage('assets/optimized/topHanged.png');
  TopOnBodyImg         = loadImage('assets/optimized/TopOnBody.png');
  foldedShortPantImg   = loadImage('assets/optimized/foldedShortPant.png');
  shortPantOnBodyImg   = loadImage('assets/optimized/shortPantOnBody.png');
  shirtBodyImg         = loadImage('assets/optimized/shirtBody.png');
  OverallSelectedImg   = loadImage('assets/optimized/OverallSelected.png');
  socksSelectedImg     = loadImage('assets/optimized/socksSelected.png');
  SocksClosetImg       = loadImage('assets/optimized/SocksCloset.png');
  foldedLongPantImg    = loadImage('assets/optimized/foldedLongPant.png');
  ShirtHangedImg       = loadImage('assets/optimized/ShirtHanged.png');
  OverallInClosetImg   = loadImage('assets/optimized/OverallInCloset.png');
  longPantImg          = loadImage('assets/optimized/long pant.png');
}

// ────────────────────────────────────────────────────────────────────────────
// 5.  SETUP  – build every sprite once at DESIGN-space sizes
// ────────────────────────────────────────────────────────────────────────────
function setup() {
  const c = createCanvas(100, 100);    // size corrected in handleResize()
  c.parent('sketch-holder');
  allSprites.drag = 10;

  // helper to make a sprite from design record
  const make = (rec, isStatic=false) => {
    const s = new Sprite(rec.x, rec.y,
                         rec.w ?? 50,
                         rec.h ?? 50,
                         isStatic ? 'static' : 'none');
    s.designX = rec.x;                     // store design coords & dims
    s.designY = rec.y;
    s.designW = rec.w;
    s.designH = rec.h;
    s.designColliderWidth  = rec.w;
    s.designColliderHeight = rec.h;
    s.baseImageScale = BASE_IMG_SCALE;
    s.rotationLock = true;
    return s;
  };

  //  █ CLOTHING
  overall     = make(D.overall);      overall.img     = OverallInClosetImg;
  longPants   = make(D.longPantsFolded);
  longPants.img = foldedLongPantImg;  // folded start

  socks       = make(D.socks);
  socks.img   = SocksClosetImg;

  shortPants  = make(D.shortPant);    shortPants.img  = foldedShortPantImg;
  shoes       = make(D.shoes);        shoes.img       = shoesImg;
  shirt       = make(D.shirt);        shirt.img       = ShirtHangedImg;
  topClothing = make(D.top);          topClothing.img = topHangedImg;

  // flags for drag
  [overall,longPants,socks,shortPants,shoes,shirt,topClothing].forEach(s=>{
      s.isDraggable = true;
  });

  //  █ WEAR / DROP ZONES  (invisible but scalable)
  dropZone           = make(D.dropZone,         true); dropZone.visible = false;
  foldedDropZone     = make(D.foldedDropZone,   true); foldedDropZone.visible = false;
  socksWearZone      = make(D.socksWearZone,    true); socksWearZone.visible = false;
  shirtWearZone      = make(D.shirtWearZone,    true); shirtWearZone.visible = false;
  overallWearZone    = make(D.overallWearZone,  true); overallWearZone.visible = false;
  shortPantsWearZone = make(D.shortPantsWearZone,true); shortPantsWearZone.visible = false;
  shoesWearZone      = make(D.shoesWearZone,    true); shoesWearZone.visible = false;
  topWearZone        = make(D.topWearZone,      true); topWearZone.visible = false;

  //  █ MUSIC
  bgMusic.loop();  bgMusic.setVolume(0.5);

  if (DEBUG_MODE) {
    allSprites.debug = true;          // green collider rectangles
    const zones = [dropZone, foldedDropZone, socksWearZone, shirtWearZone,
                   overallWearZone, shortPantsWearZone, shoesWearZone, topWearZone];
    zones.forEach(z => { z.visible = true; z.color = color(255,0,0,80); });
  }

  socks.layer = 1;
  shoes.layer = 2;
  longPants.layer = 3;

  handleResize();            // initial geometry
}

/* ─── NEXT-SCENE button helper ─────────────────────────────────── */
function updateNextButtonVisibility () {
  const btn = document.getElementById('next_scene_button');
  const allReady =
        (topWornItem    === 'shirt')   &&   // shirt is on the body
        (bottomWornItem === 'longPants') && // long pants are on the body
        isShoesWorn;                       // shoes are on the body
  btn.style.display = allReady ? 'block' : 'none';
}

// ────────────────────────────────────────────────────────────────────────────
// 6.  RESPONSIVE CORE  (identical logic to luggageScene.js)
// ────────────────────────────────────────────────────────────────────────────
function handleResize() {
  const main   = document.getElementById('main-container');
  const bgImg  = document.getElementById('bg-image');
  const holder = document.getElementById('sketch-holder');

  if (!main || !bgImg || !holder) {   // should never happen
    canvasW = windowWidth;
    canvasH = windowHeight;
    holder.style.left = '0px';
    holder.style.top  = '0px';
    holder.style.width  = canvasW + 'px';
    holder.style.height = canvasH + 'px';
  } else {
    canvasW = bgImg.offsetWidth;
    canvasH = bgImg.offsetHeight;

    const mainRect = main.getBoundingClientRect();
    const bgRect   = bgImg.getBoundingClientRect();
    holder.style.width  = canvasW + 'px';
    holder.style.height = canvasH + 'px';
    holder.style.left = (bgRect.left - mainRect.left) + 'px';
    holder.style.top  = (bgRect.top  - mainRect.top ) + 'px';
  }

  resizeCanvas(canvasW, canvasH);
  currentScale = Math.min(canvasW / DESIGN_W, canvasH / DESIGN_H);
  if (!currentScale || isNaN(currentScale) || currentScale === 0) currentScale = 1;
  updateAllSpriteGeometry();
}

function updateAllSpriteGeometry() {
  const all = allSprites;   // p5play helper list of all created sprites
  all.forEach(s => {
    // skip sprite while user is dragging it
    if (s.isDragging) return;

    if (s.designX !== undefined) {
      s.x = sc(s.designX);
      s.y = sc(s.designY);
    }
    if (s.designColliderWidth !== undefined) {
      s.width  = sc(s.designColliderWidth);
      s.height = sc(s.designColliderHeight);
    }
    if (s.img && s.baseImageScale !== undefined) {
      s.image.scale = s.baseImageScale * currentScale;
    }
  });
}

function windowResized() { handleResize(); }

/* ═════════════════ 7 ░░░ RESPONSIVE GAME-LOGIC ░░░══════════════════ */

/* ─── little helpers ────────────────────────────────────────────── */
function applyImage(sprite, img) {
  if (img) sprite.img = img;
  if (sprite.img) sprite.image.scale = sprite.baseImageScale * currentScale;
}

function moveToRack(sprite, designRec, img) {
  sprite.designX = designRec.x;
  sprite.designY = designRec.y;
  applyImage(sprite, img);
  updateAllSpriteGeometry();        // <─ moves it visually
}

function showDialogue(txt, snd, msFallback = 0, imgId = null) {
  const box = document.getElementById('dialogueText');
  const img = imgId ? document.getElementById(imgId) : null;
  if (img) {
    box.style.display = 'none';
    img.style.display = 'block';
    if (snd) {
      snd.play();
      snd.onended(() => (img.style.display = 'none'));
    } else if (msFallback > 0) {
      setTimeout(() => (img.style.display = 'none'), msFallback);
    }
  } else {
    box.textContent = txt;
    box.style.display = 'block';
    if (snd) {
      snd.play();
      snd.onended(() => (box.style.display = 'none'));
    } else if (msFallback > 0) {
      setTimeout(() => (box.style.display = 'none'), msFallback);
    }
  }
}

/* ─── draw ───────────────────────────────────────────────────────── */
function draw() {
  clear();
  updateAllSpriteGeometry();        // keep every sprite in sync with scale

  /* DEBUG overlay – unchanged */
  /*
  fill(0);
  textSize(18);
  const dbg = [
    ['Shirt', shirt], ['Overall', overall], ['Long Pants', longPants],
    ['Short Pants', shortPants], ['Shoes', shoes], ['Socks', socks],
    ['Top', topClothing]
  ];
  dbg.forEach((p, i) =>
    text(`${p[0]}: x=${Math.round(p[1].x)}, y=${Math.round(p[1].y)}`, 20, 30 + i * 20)
  );*/

  
  /* Magnetic pull for long pants (same behaviour, scaled) */
  /*
  if (longPants?.isDragging) {
    const d = dist(longPants.x, longPants.y, dropZone.x, dropZone.y);
    if (d < sc(100)) {
      const pull = map(d, 0, sc(100), 0.3, 0);
      longPants.x = lerp(longPants.x, dropZone.x, pull);
      longPants.y = lerp(longPants.y, dropZone.y, pull);
    }
  }*/
}

function mouseInsideSprite(sp) {
    // distance to sprite centre
    const dx = Math.abs(mouseX - sp.x);
    const dy = Math.abs(mouseY - sp.y);
  
    // ➊ inside rectangle?
    const insideRect =
          dx <= sp.width  / 2 &&
          dy <= sp.height / 2;
  
    if (!insideRect) return false;
  
    // ➋ inside circle whose radius = max(width,height)/2 ?
    const r = Math.max(sp.width, sp.height) / 2;
    return dx * dx + dy * dy <= r * r;
  }

function mousePressed() {
  const tryStartDrag = (sprite, newImg) => {
    sprite.isDragging = true;
    currentlyDragged = sprite;
    applyImage(sprite, newImg);
    if (!clothesSound.isPlaying()) {
      clothesSound.play();
      clothesSound.setVolume(0.5);
    }
  };

   // which sprite is under the cursor? 
  const sprites = [overall, longPants, socks, shortPants, shoes, shirt, topClothing];
  sprites.forEach(sp => {
    if (!sp.isDragging && mouseInsideSprite(sp)) {
       // sprite-specific start-drag actions 
      if (sp === longPants) {
        tryStartDrag(sp, longPantImg);
        sp.width = sc(D.dropZone.w);
        sp.height = sc(D.dropZone.h);
      } else if (sp === shortPants) {
        tryStartDrag(sp, shortPantOnBodyImg);
      } else if (sp === shirt) {
        tryStartDrag(sp, shirtBodyImg);
      } else if (sp === topClothing) {
        tryStartDrag(sp, TopOnBodyImg);
      } else if (sp === socks && !isSocksWorn) {
        tryStartDrag(sp, socksSelectedImg);
      } else if (sp === overall) {
        tryStartDrag(sp, OverallSelectedImg);
      } else if (sp === shoes) {
        tryStartDrag(sp, null);     // image unchanged
      }
    }
  });
}


/* ─── mouseDragged ──────────────────────────────────────────────── */
function mouseDragged() {
  if (currentlyDragged) {
    currentlyDragged.x = mouseX;
    currentlyDragged.y = mouseY;
  }
}

/* ─── mouseReleased ─────────────────────────────────────────────── */
function mouseReleased() {
  if (!currentlyDragged) return;
  const s = currentlyDragged;
  currentlyDragged = null;

  s.isDragging = false;

  if (clothesSound.isPlaying()) clothesSound.stop();

  /* =========== SOCKS ================================================== */
  if (s === socks) {
    if (dist(s.x, s.y, socksWearZone.x, socksWearZone.y) < sc(55)) {
      s.designX = D.socksWearZone.x;
      s.designY = D.socksWearZone.y - 13;
      applyImage(s, socksInFeetImg);
      isSocksWorn = true;
      clothesDropSound.play();
    } else {
      moveToRack(s, D.socks, SocksClosetImg);
      isSocksWorn = false;
    }
    return;
  }

  /* =========== SHOES ================================================== */
  if (s === shoes) {
    if (dist(s.x, s.y, shoesWearZone.x, shoesWearZone.y) < sc(60)) {
      s.designX = D.shoesWearZone.x;
      s.designY = D.shoesWearZone.y;
      updateAllSpriteGeometry();
      clothesDropSound.play();
      showDialogue(
        '', // No text
        sneakersSound,
        0,
        'sneakersSpeechImg' // Show the image instead
      );
      isShoesWorn = true;
    } else {
      moveToRack(s, D.shoes, shoesImg);
      isShoesWorn = false;
    }
    updateNextButtonVisibility();
    return;
  }

  /* helpers for conflict handling */
  const putTopBack = () => {
    if (topWornItem === 'shirt')    moveToRack(shirt, D.shirt, ShirtHangedImg);
    if (topWornItem === 'top')      moveToRack(topClothing, D.top, topHangedImg);
    if (topWornItem === 'overall') {
      moveToRack(overall, D.overall, OverallInClosetImg);
      bottomWornItem = null;
    }
    topWornItem = null;
  };
  const putBottomBack = () => {
    if (bottomWornItem === 'longPants')   moveToRack(longPants, D.longPantsFolded, foldedLongPantImg);
    if (bottomWornItem === 'shortPants')  moveToRack(shortPants, D.shortPant, foldedShortPantImg);
    if (bottomWornItem === 'overall') {
      moveToRack(overall, D.overall, OverallInClosetImg);
      topWornItem = null;
    }
    bottomWornItem = null;
  };

  /* =========== SHIRT ================================================== */
  if (s === shirt) {
    if (dist(s.x, s.y, shirtWearZone.x, shirtWearZone.y) < sc(100)) {
      putTopBack();
      s.designX = D.shirtWearZone.x;
      s.designY = D.shirtWearZone.y - 15;
      applyImage(s, shirtBodyImg);
      topWornItem = 'shirt';
      isShirtWorn = true;
      clothesDropSound.play();
      showDialogue(
        '', // No text
        shirtRahaSound,
        0,
        'shirtSpeechImg' // Show the image instead
      );
    } else {
      moveToRack(s, D.shirt, ShirtHangedImg);
      isShirtWorn = false;
      if (topWornItem === 'shirt') topWornItem = null;
    }
    updateNextButtonVisibility();
    return;
  }

  /* =========== TOP  (Crop-top) ======================================= */
  if (s === topClothing) {
    if (dist(s.x, s.y, topWearZone.x, topWearZone.y) < sc(100)) {
      putTopBack();
      s.designX = D.topWearZone.x;
      s.designY = D.topWearZone.y;
      applyImage(s, TopOnBodyImg);
      topWornItem = 'top';
      clothesDropSound.play();
      showDialogue(
        '', // No text
        cropTopSound,
        0,
        'cropTopSpeechImg' // Show the image instead
      );
    } else {
      moveToRack(s, D.top, topHangedImg);
      if (topWornItem === 'top') topWornItem = null;
    }
    return;
  }

  /* =========== LONG PANTS ============================================ */
  if (s === longPants) {
    const dWear = dist(s.x, s.y, dropZone.x, dropZone.y);
    if (dWear < sc(100)) {
      putBottomBack();
      s.designX = D.dropZone.x;
      s.designY = D.dropZone.y;
      applyImage(s, longPantImg);
      bottomWornItem = 'longPants';
      isPantInDropZone = true;
      clothesDropSound.play();
      showDialogue(
        '', // No text
        longPantRahaSound,
        0,
        'pantSpeechImg' // Show the image instead
      );
    } else {
      moveToRack(s, D.longPantsFolded, foldedLongPantImg);
      isPantInDropZone = false;
      if (bottomWornItem === 'longPants') bottomWornItem = null;
    }
    updateNextButtonVisibility();
    return;
  }

  /* =========== SHORT PANTS =========================================== */
  if (s === shortPants) {
    if (dist(s.x, s.y, shortPantsWearZone.x, shortPantsWearZone.y) < sc(100)) {
      putBottomBack();
      s.designX = D.shortPantsWearZone.x;
      s.designY = D.shortPantsWearZone.y;
      applyImage(s, shortPantOnBodyImg);
      bottomWornItem = 'shortPants';
      clothesDropSound.play();
      showDialogue(
        '', // No text
        shortPantSound,
        0,
        'shortPantSpeechImg' // Show the image instead
      );
    } else {
      moveToRack(s, D.shortPant, foldedShortPantImg);
      if (bottomWornItem === 'shortPants') bottomWornItem = null;
    }
    return;
  }

  /* =========== OVERALL =============================================== */
  if (s === overall) {
    if (dist(s.x, s.y, overallWearZone.x, overallWearZone.y) < sc(100)) {
      putTopBack();
      putBottomBack();
      s.designX = D.overallWearZone.x;
      s.designY = D.overallWearZone.y;
      applyImage(s, OverallSelectedImg);
      topWornItem = bottomWornItem = 'overall';
      clothesDropSound.play();
      showDialogue(
        '', // No text
        overallRahaSound,
        0,
        'overallSpeechImg' // Show the image instead
      );
    } else {
      moveToRack(s, D.overall, OverallInClosetImg);
      if (topWornItem === 'overall') topWornItem = null;
      if (bottomWornItem === 'overall') bottomWornItem = null;
    }
    return;
  }
}

/* ══════════════════════════════════════════════════════════════════ */