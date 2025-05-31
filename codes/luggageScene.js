// let backgroundImg;
// let background;
let shirtImg, unfoldedShirtImg;
let shirt;
// let mouseSprite; // No longer needed
let kimonoImg, unfoldedKimonoImg;
let kimono;
let foldedSkirtImg, unfoldedSkirtImg;
let foldedSkirt;

let foldedYellowImg, unfoldedYellowImg;
let foldedYellow;

let noSleeveShirtImg, unfoldedNoSleeveImg;
let noSleeveShirt;

let foldedJeanImg, unfoldedJeanImg;
let jean;

let foldedShortPantImg, unfoldedShortPantImg;
let foldedShortPant;

let displayTextImg;
let showKimonoText = false;
let skirtTextImg;
let showSkirtText = false;

let kimonoSound, skirtSound, clothesMovementSound;
let isKimonoSoundPlaying = false;
let isSkirtSoundPlaying = false;
let isClothesMovementPlaying = false;

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;
const BASE_IMAGE_VISUAL_SCALE = 0.70; // Using the larger scale from previous adjustment
let currentScale = 1;
let actualCanvasWidth, actualCanvasHeight;

let currentlyDraggedSprite = null;

function preload() {
  shirtImg = loadImage("../assets/luggageScene/Tshirt.png");
  unfoldedShirtImg = loadImage("../assets/luggageScene/TshirtUnfolded.png");
  kimonoImg = loadImage("../assets/luggageScene/Kimono.png");
  unfoldedKimonoImg = loadImage("../assets/luggageScene/KimonoUnfolded.png");
  foldedSkirtImg = loadImage("../assets/luggageScene/Skirt.png");
  unfoldedSkirtImg = loadImage("../assets/luggageScene/SkirtUnfolded.png");
  noSleeveShirtImg = loadImage("../assets/luggageScene/Top.png");
  unfoldedNoSleeveImg = loadImage("../assets/luggageScene/TopUnfolded.png");
  foldedYellowImg = loadImage("../assets/luggageScene/ShortSleeveShirt.png");
  unfoldedYellowImg = loadImage("../assets/luggageScene/ShortSleeveShirtUnfolded.png");
  foldedJeanImg = loadImage("../assets/luggageScene/Jean.png");
  unfoldedJeanImg = loadImage("../assets/luggageScene/JeanUnfolded.png");
  foldedShortPantImg = loadImage("../assets/luggageScene/ShortPant.png");
  unfoldedShortPantImg = loadImage("../assets/luggageScene/ShortPantUnfolded.png");
  displayTextImg = loadImage("../assets/luggageScene/kimonoTextBox.png");
  skirtTextImg = loadImage("../assets/luggageScene/SkirtTextBox.png");
  kimonoSound = loadSound("../assets/luggageScene/kimono.mp3");
  clothesMovementSound = loadSound("../assets/luggageScene/clothesMovement.mp3");
  try {
    skirtSound = loadSound("../assets/luggageScene/Skirt.m4a");
  } catch (e) {
    console.warn("Skirt sound not loaded, check path: ../assets/luggageScene/Skirt.m4a");
    // Fallback or error handling for sound
  }
}

function setup() {
  let p5canvas = createCanvas(100, 100);
  p5canvas.parent("sketch-holder");
  //allSprites.drag = 10; // Might need to comment out if problems persist

  //Top-Left Purple Tshirt
  shirt = new Sprite();
  shirt.img = shirtImg;
  shirt.designX = 510; shirt.designY = 595; // (+105
  shirt.designColliderWidth = 90 * 1.2; shirt.designColliderHeight = 100 * 1.2;
  shirt.baseImageScale = BASE_IMAGE_VISUAL_SCALE;
  shirt.collider = 'kinematic';
  shirt.isDraggable = false; // This will be set by mouse.hovering()
  shirt.isPlaced = false;
  shirt.placedDesignX = 0; 
  shirt.placedDesignY = 0; 

  //Bottom-Left Kimono
  kimono = new Sprite();
  kimono.img = kimonoImg;
  kimono.designX = 530; kimono.designY = 720; //+ 100
  kimono.designColliderWidth = 110 * 1.25; kimono.designColliderHeight = 80 * 1.25;
  kimono.baseImageScale = BASE_IMAGE_VISUAL_SCALE;
  kimono.collider = 'kinematic';
  kimono.isDraggable = false;

  //Bottom-Middle Skirt
  foldedSkirt = new Sprite();
  foldedSkirt.img = foldedSkirtImg;
  foldedSkirt.designX = 680; foldedSkirt.designY = 725;
  foldedSkirt.designColliderWidth = 80 * 1.25; foldedSkirt.designColliderHeight = 80 * 1.25;
  foldedSkirt.baseImageScale = BASE_IMAGE_VISUAL_SCALE;
  foldedSkirt.collider = 'kinematic';
  foldedSkirt.isDraggable = false;

  //Bottom-Right Jean
  jean = new Sprite();
  jean.img = foldedJeanImg;
  jean.designX = 810; jean.designY = 725;
  jean.designColliderWidth = 80 * 1.25; jean.designColliderHeight = 80 * 1.25;
  jean.baseImageScale = BASE_IMAGE_VISUAL_SCALE;
  jean.collider = 'kinematic';
  jean.isDraggable = false;
  jean.isPlaced = false;
  jean.placedDesignX = 0; 
  jean.placedDesignY = 0;

  //Top-Middle Pinnk No Sleeve
  noSleeveShirt = new Sprite();
  noSleeveShirt.img = noSleeveShirtImg;
  noSleeveShirt.designX = 620; noSleeveShirt.designY = 595;
  noSleeveShirt.designColliderWidth = 60 * 1.25; noSleeveShirt.designColliderHeight = 95 * 1.25;
  noSleeveShirt.baseImageScale = BASE_IMAGE_VISUAL_SCALE;
  noSleeveShirt.collider = 'kinematic';
  noSleeveShirt.isDraggable = false;
  noSleeveShirt.isPlaced = false;
  noSleeveShirt.placedDesignX = 0; 
  noSleeveShirt.placedDesignY = 0;

  //Top-Right Yellow Shirt
  foldedYellow = new Sprite();
  foldedYellow.img = foldedYellowImg;
  foldedYellow.designX = 820; foldedYellow.designY = 595;
  foldedYellow.designColliderWidth = 100 * 1.25; foldedYellow.designColliderHeight = 85 * 1.25;
  foldedYellow.baseImageScale = BASE_IMAGE_VISUAL_SCALE;
  foldedYellow.collider = 'kinematic';
  foldedYellow.isDraggable = false;
  foldedYellow.isPlaced = false;
  foldedYellow.placedDesignX = 0; 
  foldedYellow.placedDesignY = 0;

  //Top-Middle Short Pant
  foldedShortPant = new Sprite();
  if (foldedShortPantImg) foldedShortPant.img = foldedShortPantImg; else console.error("foldedShortPantImg did not load");
  foldedShortPant.designX = 710; foldedShortPant.designY = 595;
  foldedShortPant.designColliderWidth = 60 * 1.2; foldedShortPant.designColliderHeight = 60 * 1.2;
  foldedShortPant.baseImageScale = BASE_IMAGE_VISUAL_SCALE;
  foldedShortPant.collider = 'kinematic';
  foldedShortPant.isDraggable = false;
  foldedShortPant.isPlaced = false;
  foldedShortPant.placedDesignX = 0; 
  foldedShortPant.placedDesignY = 0;

  targetSprite = new Sprite();
  targetSprite.designX = 1315 ; targetSprite.designY = 500 ;
  targetSprite.designColliderWidth = 590; targetSprite.designColliderHeight = 950; // Scaled target too
  //targetSprite.baseImageScale = 1.0;
  targetSprite.collider = 'kinematic';
  targetSprite.visible = false; // Optional: make target visible for debugging
  targetSprite.color = color(0,255,0,100); // Semi-transparent green

  handleResize();
  //allSprites.debug = true;
}

function handleResize() {
  const mainContainer = document.getElementById('main-container');
  const bgImageEl = document.getElementById('bg-image');
  const sketchHolderEl = document.getElementById('sketch-holder');
  if (!mainContainer || !bgImageEl || !sketchHolderEl) {
    actualCanvasWidth = windowWidth; actualCanvasHeight = windowHeight;
    if (sketchHolderEl) {
        sketchHolderEl.style.left = '0px'; sketchHolderEl.style.top = '0px';
        sketchHolderEl.style.width = windowWidth + 'px'; sketchHolderEl.style.height = windowHeight + 'px';
    }
  } else {
    actualCanvasWidth = bgImageEl.offsetWidth; actualCanvasHeight = bgImageEl.offsetHeight;
    const mainRect = mainContainer.getBoundingClientRect(); const bgRect = bgImageEl.getBoundingClientRect();
    sketchHolderEl.style.width = actualCanvasWidth + 'px'; sketchHolderEl.style.height = actualCanvasHeight + 'px';
    sketchHolderEl.style.left = (bgRect.left - mainRect.left) + 'px'; sketchHolderEl.style.top = (bgRect.top - mainRect.top) + 'px';
  }
  resizeCanvas(actualCanvasWidth, actualCanvasHeight);
  currentScale = actualCanvasWidth / DESIGN_WIDTH;
  if (isNaN(currentScale) || currentScale === 0) currentScale = actualCanvasHeight / DESIGN_HEIGHT;
  if (isNaN(currentScale) || currentScale === 0) currentScale = 1;
  updateAllSpriteProperties();
}

function updateAllSpriteProperties() {
  if (currentScale === 0 || isNaN(currentScale)) return;
  const sprites = [shirt, kimono, foldedSkirt, jean, noSleeveShirt, foldedYellow, foldedShortPant, targetSprite];

  sprites.forEach(s => {
    if (s && typeof s.designX === 'number') { // designX check implies it's one of our main sprites
      // --- POSITIONING LOGIC ---
      if (s !== currentlyDraggedSprite) {
        if (s === targetSprite) {
          s.x = s.designX * currentScale;
          s.y = s.designY * currentScale;
        } else if (s === kimono || s === foldedSkirt) {
          s.x = s.designX * currentScale;
          s.y = s.designY * currentScale;
        } else if (typeof s.isPlaced === 'boolean') { // For placeable clothes
          if (s.isPlaced) {
            // If placed, use its stored placedDesignX/Y
            s.x = s.placedDesignX * currentScale;
            s.y = s.placedDesignY * currentScale;
          } else {
            // Not placed, so use its initial designX/Y
            s.x = s.designX * currentScale;
            s.y = s.designY * currentScale;
          }
        }
      }

      // --- DIMENSIONS AND IMAGE SCALE (Always update for all sprites) ---
      if (typeof s.designColliderWidth === 'number') {
        s.width = s.designColliderWidth * currentScale;
        s.height = s.designColliderHeight * currentScale;
      }
      if (s.img && typeof s.baseImageScale === 'number') {
        s.image.scale = s.baseImageScale * currentScale;
      }
    }
  });
}


function windowResized() { handleResize(); }

function draw() {
  clear();
  // mouseSprite.x = mouseX; mouseSprite.y = mouseY; // REMOVED

  resetKimonoSound(); resetSkirtSound();

  const allClothingSprites = [shirt, kimono, foldedSkirt, jean, noSleeveShirt, foldedYellow, foldedShortPant];

  if (!currentlyDraggedSprite) {
    allClothingSprites.forEach(s => {
        s.isDraggable = s.mouse.hovering(); // Use p5.play's mouse detection
    });
  } else {
    allClothingSprites.forEach(s => {
        if (s !== currentlyDraggedSprite) s.isDraggable = false;
    });
  }

  const textBoxBaseScale = BASE_IMAGE_VISUAL_SCALE;
  if (showKimonoText && isKimonoSoundPlaying && displayTextImg) {
    let scaledWidth = displayTextImg.width * textBoxBaseScale * currentScale;
    let scaledHeight = displayTextImg.height * textBoxBaseScale * currentScale;
    image(displayTextImg, (actualCanvasWidth - scaledWidth) / 2, actualCanvasHeight - scaledHeight - (20 * currentScale), scaledWidth, scaledHeight);
  }
  if (showSkirtText && isSkirtSoundPlaying && skirtTextImg) {
    let scaledWidth = skirtTextImg.width * textBoxBaseScale * currentScale;
    let scaledHeight = skirtTextImg.height * textBoxBaseScale * currentScale;
    image(skirtTextImg, (actualCanvasWidth - scaledWidth) / 2, actualCanvasHeight - scaledHeight - (20 * currentScale), scaledWidth, scaledHeight);
  }
}

function mousePressed() {
  if (!currentlyDraggedSprite) {
    let pickedSprite = null;
    // Check in reverse order of typical drawing or based on Z-index if they overlap significantly.
    // This order ensures that if sprites are stacked, the "topmost" one under the mouse is picked.
    const allClothingSprites = [shirt, kimono, foldedSkirt, jean, noSleeveShirt, foldedYellow, foldedShortPant];

    for (let i = allClothingSprites.length - 1; i >= 0; i--) {
        const s = allClothingSprites[i];
        if (s.mouse.pressing()) { // Key change: use sprite.mouse.pressing()
            pickedSprite = s;
            break; // Found the sprite, stop checking
        }
    }

    if (pickedSprite) {
      currentlyDraggedSprite = pickedSprite;
      // Apply unfolded image and sound logic
      if (pickedSprite === shirt) pickedSprite.img = unfoldedShirtImg;
      else if (pickedSprite === kimono) {
        pickedSprite.img = unfoldedKimonoImg;
        if (isSkirtSoundPlaying && skirtSound) skirtSound.stop(); isSkirtSoundPlaying = false; showSkirtText = false;
        if (!isKimonoSoundPlaying && kimonoSound) {
          kimonoSound.play(); isKimonoSoundPlaying = true; showKimonoText = true;
          kimonoSound.onended(() => { isKimonoSoundPlaying = false; showKimonoText = false; });
        }
      } else if (pickedSprite === foldedSkirt) {
        pickedSprite.img = unfoldedSkirtImg;
        if (isKimonoSoundPlaying && kimonoSound) kimonoSound.stop(); isKimonoSoundPlaying = false; showKimonoText = false;
        if (!isSkirtSoundPlaying && skirtSound) {
          skirtSound.play(); isSkirtSoundPlaying = true; showSkirtText = true;
          skirtSound.onended(() => { isSkirtSoundPlaying = false; showSkirtText = false; });
        }
      } else if (pickedSprite === jean) pickedSprite.img = unfoldedJeanImg;
      else if (pickedSprite === noSleeveShirt) pickedSprite.img = unfoldedNoSleeveImg;
      else if (pickedSprite === foldedYellow) pickedSprite.img = unfoldedYellowImg;
      else if (pickedSprite === foldedShortPant) pickedSprite.img = unfoldedShortPantImg;

      if (pickedSprite.img && typeof pickedSprite.baseImageScale === 'number') {
        pickedSprite.image.scale = pickedSprite.baseImageScale * currentScale;
      }
    }
  }
}

function mouseDragged() {
  if (currentlyDraggedSprite) {
    currentlyDraggedSprite.x = mouseX;
    currentlyDraggedSprite.y = mouseY;
    if (!isClothesMovementPlaying && clothesMovementSound) {
      clothesMovementSound.play();
      isClothesMovementPlaying = true;
      // REMOVED: clothesMovementSound.onended(() => { isClothesMovementPlaying = false; });
    }
  }
}

function mouseReleased() {
  if (currentlyDraggedSprite) {
    const releasedSprite = currentlyDraggedSprite; // Cache before nulling

    // --- STOP CLOTHES MOVEMENT SOUND ---
    if (isClothesMovementPlaying && clothesMovementSound) {
      clothesMovementSound.stop(); // Explicitly stop the sound
      isClothesMovementPlaying = false; // Reset the flag
    }
    // --- END OF SOUND STOP ---

    // --- RESET IMAGE TO FOLDED ---
    if (releasedSprite === shirt) {
      shirt.img = shirtImg;
    } else if (releasedSprite === kimono) {
      kimono.img = kimonoImg;
    } else if (releasedSprite === foldedSkirt) {
      foldedSkirt.img = foldedSkirtImg;
    } else if (releasedSprite === jean) {
      jean.img = foldedJeanImg;
    } else if (releasedSprite === noSleeveShirt) {
      noSleeveShirt.img = noSleeveShirtImg;
    } else if (releasedSprite === foldedYellow) {
      foldedYellow.img = foldedYellowImg;
    } else if (releasedSprite === foldedShortPant) {
      foldedShortPant.img = foldedShortPantImg;
    }
    if (releasedSprite.img && typeof releasedSprite.baseImageScale === 'number') {
      releasedSprite.image.scale = releasedSprite.baseImageScale * currentScale;
    }
    // --- END OF IMAGE RESET ---

    let shouldSnapBackToDesign = false;
    let wasSuccessfullyPlaced = false;
    let isOverlappingTarget = false; // Initialize to false

    if (releasedSprite === kimono || releasedSprite === foldedSkirt) {
      shouldSnapBackToDesign = true;
      if (typeof releasedSprite.isPlaced === 'boolean') releasedSprite.isPlaced = false;
      // For kimono/skirt, overlap status for 'Done' check will be evaluated later if needed
    } else {
      // This is for shirt, jean, noSleeveShirt, foldedYellow, foldedShortPant
      if (targetSprite) {
        // --- MANUAL AABB OVERLAP CHECK ---
        let r1 = releasedSprite;
        let r2 = targetSprite;

        let r1L = r1.x - r1.width / 2;
        let r1R = r1.x + r1.width / 2;
        let r1T = r1.y - r1.height / 2;
        let r1B = r1.y + r1.height / 2;

        let r2L = r2.x - r2.width / 2;
        let r2R = r2.x + r2.width / 2;
        let r2T = r2.y - r2.height / 2;
        let r2B = r2.y + r2.height / 2;

        isOverlappingTarget = !(r1R < r2L || r1L > r2R || r1B < r2T || r1T > r2B); // Assign to the main variable
        // --- END OF MANUAL AABB OVERLAP CHECK ---

        let isOverlappingTarget_p5play = releasedSprite.overlapping(targetSprite); // Keep for comparison log

        if (isOverlappingTarget) { // Now using the result of the manual check
          shouldSnapBackToDesign = false; // Stay in place
          if (typeof releasedSprite.isPlaced === 'boolean') {
            releasedSprite.isPlaced = true; // Mark as placed
            // STORE THE PLACED POSITION RELATIVE TO DESIGN RESOLUTION
            releasedSprite.placedDesignX = releasedSprite.x / currentScale;
            releasedSprite.placedDesignY = releasedSprite.y / currentScale;
            wasSuccessfullyPlaced = true;
          } else {
          }
        } else {
          // Not overlapping target (according to manual check), so snap back
          shouldSnapBackToDesign = true;
          if (typeof releasedSprite.isPlaced === 'boolean') {
            releasedSprite.isPlaced = false; // Reset placed status
          }
        }
      } else {
        shouldSnapBackToDesign = true; // Default to snapping back if target is missing
      }
    }

    if (shouldSnapBackToDesign) {
      releasedSprite.x = releasedSprite.designX * currentScale;
      releasedSprite.y = releasedSprite.designY * currentScale;
      if (typeof releasedSprite.isPlaced === 'boolean') {
        if (releasedSprite.isPlaced) { console.log(releasedSprite.constructor.name, "isPlaced reset to false due to snap back"); }
        releasedSprite.isPlaced = false;
        releasedSprite.placedDesignX = 0; // Reset these too
        releasedSprite.placedDesignY = 0;
      }
    } else if (wasSuccessfullyPlaced) { // Changed from else to else if (wasSuccessfullyPlaced)
    }

    currentlyDraggedSprite = null;
  }

  // Game completion check (using p5play's overlapping for kimono/skirt as their behavior was fine)
  if (targetSprite &&
      shirt.isPlaced &&
      //(kimono.overlapping(targetSprite)) &&
      //(foldedSkirt.overlapping(targetSprite)) &&
      jean.isPlaced &&
      noSleeveShirt.isPlaced &&
      foldedYellow.isPlaced &&
      foldedShortPant.isPlaced) {
    console.log("Done - All items in target (or placed)!");
    const backButton = document.getElementById('back_to_flipbook_button');
    if (backButton) {
        backButton.style.display = 'block'; // Or 'inline-block'
    }
  }
}


function resetKimonoSound() { if (kimonoSound && !kimonoSound.isPlaying()) isKimonoSoundPlaying = false; }
function resetSkirtSound() { if (skirtSound && !skirtSound.isPlaying()) isSkirtSoundPlaying = false; }

