let backgroundImg;
let background;
let shirtImg, unfoldedShirtImg;
let shirt, unfoldedShirt;
let mouseSprite;
let kimonoImg, unfoldedKimonoImg;
let kimono, unfoldedKimono;
let foldedSkirt, foldedSkirtImg; //folded skirt
let unfoldedSkirt, unfoldedSkirtImg; //unfolded skirt

let foldedYellow, foldedYellowImg; //folded yellow
let unfoldedYellow, unfoldedYellowImg; //unfolded yellow

let noSleeveShirt, noSleeveShirtImg; //nosleeve shirt
let unfoldednoSleeve, unfoldedNoSleeveImg; //unfolded no sleeve shirt

let foldedJean, foldedJeanImg; //folded skirt
let unfoldedJean, unfoldedJeanImg; //unfolded skirt

let displayTextImg; // Variable for the image
let showKimonoText = false; // Initially, the text should not be visible
let skirtTextImg;
let showSkirtText = false;

// Audio elements
let kimonoSound, skirtSound, clothesMovementSound;
let isKimonoSoundPlaying = false;
let isSkirtSoundPlaying = false;
let isClothesMovementPlaying = false;

let iMacWidth = 1920;
let iMacHeight = 1080;
let coef = 0.6;

let currentlyDraggedSprite = null;

//let kimonoSound; // Variable for the sound
//let displayTextImg; // Variable for the image

function preload() {
  backgroundImg = loadImage("../assets/luggageScene/LuggageScene.png");
  shirtImg = loadImage("../assets/luggageScene/Tshirt.png");
  unfoldedShirtImg = loadImage("../assets/luggageScene/TshirtUnfolded.png");
  kimonoImg = loadImage("../assets/luggageScene/Kimono.png");
  unfoldedKimonoImg = loadImage("../assets/luggageScene/KimonoUnfolded.png");
  // Get references to audio elements
  kimonoSound = document.getElementById('kimonoAudio');
  skirtSound = document.getElementById('skirtAudio');
  clothesMovementSound = document.getElementById('clothesAudio');
  
  foldedSkirtImg = loadImage("../assets/luggageScene/Skirt.png");
  unfoldedSkirtImg = loadImage("../assets/luggageScene/SkirtUnfolded.png");
  noSleeveShirtImg = loadImage("../assets/luggageScene/Top.png");
  unfoldedNoSleeveImg = loadImage("../assets/luggageScene/TopUnfolded.png");
  foldedYellowImg = loadImage("../assets/luggageScene/ShortSleeveShirt.png");
  unfoldedYellowImg = loadImage("../assets/luggageScene/ShortSleeveShirtUnfolded.png");
  foldedJeanImg = loadImage("assets/luggageScene/Jean.png");
  unfoldedJeanImg = loadImage("assets/luggageScene/JeanUnfolded.png");
  displayTextImg = loadImage("assets/luggageScene/kimonoTextBox.png"); // Load the image
  skirtTextImg = loadImage("assets/luggageScene/SkirtTextBox.png");
  kimonoSound = loadSound("assets/luggageScene/kimono.mp3");
  clothesMovementSound = loadSound("assets/luggageScene/clothesMovement.mp3"); // Load clothes movement sound
  foldedSkirtImg = loadImage("../assets/luggageScene/Skirt.png");
  unfoldedSkirtImg = loadImage("../assets/luggageScene/SkirtUnfolded.png");
  noSleeveShirtImg = loadImage("../assets/luggageScene/Top.png");
  unfoldedNoSleeveImg = loadImage("../assets/luggageScene/TopUnfolded.png");
  foldedYellowImg = loadImage("../assets/luggageScene/ShortSleeveShirt.png");
  unfoldedYellowImg = loadImage("../assets/luggageScene/ShortSleeveShirtUnfolded.png");
  foldedJeanImg = loadImage("../assets/luggageScene/Jean.png");
  unfoldedJeanImg = loadImage("../assets/luggageScene/JeanUnfolded.png");
  displayTextImg = loadImage("../assets/luggageScene/kimonoTextBox.png"); // Load the image
  skirtTextImg = loadImage("../assets/luggageScene/SkirtTextBox.png");
  kimonoSound = loadSound("../assets/luggageScene/kimono.mp3");
  clothesMovementSound = loadSound("../assets/luggageScene/clothesMovement.mp3"); // Load clothes movement sound
  
  // Try to load the skirt sound from either location
  try {
    skirtSound = loadSound("../assets/luggageScene/Skirt.m4a");
  } catch(e) {
    console.log("Trying alternate path for skirt sound");
    skirtSound = loadSound("../assets/luggageScene/Skirt.m4a");
  }
}

function setup() {
  // Create canvas that fills the window
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-holder");
  allSprites.drag = 10;
  
  // Set initial canvas size
  resizeCanvas(windowWidth, windowHeight);

  targetSprite = new Sprite(0, 0 * coef, 200 * coef, 400 * coef);
  targetSprite.position = createVector(
    iMacWidth * coef * 0.7,
    (iMacHeight * coef) / 2
  );
  targetSprite.removeColliders();
  // targetSprite.visible = false;

  // Its a class so we should add new before
  shirt = new Sprite(0, 0, 160, 100);
  shirt.img = shirtImg; // add an image to a sprite
  shirt.image.scale = coef;
  console.log(shirt);
  shirt.position = createVector(460, 360);
  shirt.removeColliders();
  shirt.isDraggable = false;

  kimono = new Sprite(0, 0, 110, 80);
  kimono.removeColliders();
  kimono.img = kimonoImg; // add an image to a sprite
  kimono.image.scale = coef;
  kimono.position = createVector(300,450);

  foldedSkirt = new Sprite(0, 0, 80, 80);
  foldedSkirt.removeColliders();
  foldedSkirt.img = foldedSkirtImg; // add an image to a sprite
  foldedSkirt.image.scale = coef;
  foldedSkirt.position = createVector(400, 455);

  jean = new Sprite(0, 0, 80, 80);
  jean.removeColliders();
  jean.img = foldedJeanImg; // add an image to a sprite
  jean.image.scale = coef;
  jean.position = createVector(490, 455);

  // No Sleeve Purple
  noSleeveShirt = new Sprite(0, 0, 60, 95);
  noSleeveShirt.removeColliders();
  noSleeveShirt.img =noSleeveShirtImg; // add an image to a sprite
  noSleeveShirt.image.scale = coef;
  noSleeveShirt.position = createVector(275, 350);

  // No Sleeve Purple
  foldedYellow = new Sprite(0, 0, 50, 100);
  foldedYellow.removeColliders();
  foldedYellow.img =foldedYellowImg; // add an image to a sprite
  foldedYellow.image.scale = coef;
  foldedYellow.position = createVector(340, 355);

  mouseSprite = new Sprite(0, 0, 10, 10);
  mouseSprite.removeColliders();
  mouseSprite.visible = false;
}

function draw() {
  clear(); // Clear the canvas each frame
  
  mouseSprite.x = mouseX;
  mouseSprite.y = mouseY;

  // Check sound states
  resetKimonoSound();
  resetSkirtSound();

  // image(backgroundImg, 0, 0, iMacWidth*coef, iMacHeight* coef);
  if (shirt.overlapping(mouseSprite)) {
    shirt.isDraggable = true;
  } else {
    shirt.isDraggable = false;
  }

  if (kimono.overlapping(mouseSprite)) {
    kimono.isDraggable = true;
    
  } else {
    kimono.isDraggable = false;
  }

  if (foldedSkirt.overlapping(mouseSprite)) {
    foldedSkirt.isDraggable = true;
  } else {
    foldedSkirt.isDraggable = false;
  }

  if (jean.overlapping(mouseSprite)) {
    jean.isDraggable = true;
  } else {
    jean.isDraggable = false;
  }

  if (noSleeveShirt.overlapping(mouseSprite)) {
    noSleeveShirt.isDraggable = true;
  } else {
    noSleeveShirt.isDraggable = false;
  }

  if (foldedYellow.overlapping(mouseSprite)) {
    foldedYellow.isDraggable = true;
  } else {
    foldedYellow.isDraggable = false;
  }

  // Draw the kimono text if sound is playing
  if (showKimonoText && isKimonoSoundPlaying) {
    let scaledWidth = displayTextImg.width * coef;
    let scaledHeight = displayTextImg.height * coef;
    image(displayTextImg, (windowWidth / 2) - (scaledWidth / 2), 550, scaledWidth, scaledHeight);
  }

  // Draw the skirt text if sound is playing
  if (showSkirtText && isSkirtSoundPlaying) {
    let scaledWidth = skirtTextImg.width * coef;
    let scaledHeight = skirtTextImg.height * coef;
    image(skirtTextImg, (windowWidth / 2) - (scaledWidth / 2), 550, scaledWidth, scaledHeight);
  }
}

function mousePressed() {
  // Only check for new dragging if nothing is currently being dragged
  if (!currentlyDraggedSprite) {
    if (shirt.overlapping(mouseSprite)) {
      currentlyDraggedSprite = shirt;
      shirt.isDraggable = true;
      shirt.img = unfoldedShirtImg;
      shirt.img.scale = coef;
    } else if (kimono.overlapping(mouseSprite)) {
      currentlyDraggedSprite = kimono;
      kimono.isDraggable = true;
      kimono.img = unfoldedKimonoImg;
      kimono.img.scale = coef;
      
      // If skirt sound is playing, stop it and its text
      if (isSkirtSoundPlaying) {
        skirtSound.stop();
        isSkirtSoundPlaying = false;
        showSkirtText = false;
      }
      
      // Play kimono sound and show text
      if (!isKimonoSoundPlaying) {
        kimonoSound.play();
        isKimonoSoundPlaying = true;
        showKimonoText = true;
        kimonoSound.onended(() => {
          isKimonoSoundPlaying = false;
          showKimonoText = false;
        });
      }
    } else if (foldedSkirt.overlapping(mouseSprite)) {
      currentlyDraggedSprite = foldedSkirt;
      foldedSkirt.isDraggable = true;
      foldedSkirt.img = unfoldedSkirtImg;
      foldedSkirt.img.scale = coef;
      
      // If kimono sound is playing, stop it and its text
      if (isKimonoSoundPlaying) {
        kimonoSound.stop();
        isKimonoSoundPlaying = false;
        showKimonoText = false;
      }
      
      // Play skirt sound and show text
      if (!isSkirtSoundPlaying) {
        skirtSound.play();
        isSkirtSoundPlaying = true;
        showSkirtText = true;
        skirtSound.onended(() => {
          isSkirtSoundPlaying = false;
          showSkirtText = false;
        });
      }
    } else if (jean.overlapping(mouseSprite)) {
      currentlyDraggedSprite = jean;
      jean.isDraggable = true;
      jean.img = unfoldedJeanImg;
      jean.img.scale = coef;
    } else if (noSleeveShirt.overlapping(mouseSprite)) {
      currentlyDraggedSprite = noSleeveShirt;
      noSleeveShirt.isDraggable = true;
      noSleeveShirt.img = unfoldedNoSleeveImg;
      noSleeveShirt.img.scale = coef;
    } else if (foldedYellow.overlapping(mouseSprite)) {
      currentlyDraggedSprite = foldedYellow;
      foldedYellow.isDraggable = true;
      foldedYellow.img = unfoldedYellowImg;
      foldedYellow.img.scale = coef;
    }
  }
}

function mouseDragged() {
  // Only move the currently dragged sprite
  if (currentlyDraggedSprite && currentlyDraggedSprite.isDraggable) {
    currentlyDraggedSprite.x = mouseX;
    currentlyDraggedSprite.y = mouseY;
    
    // Play clothes movement sound if not already playing
    if (!isClothesMovementPlaying) {
      clothesMovementSound.play();
      isClothesMovementPlaying = true;
    }
    
    // Special handling for kimono text
    if (currentlyDraggedSprite === kimono && isKimonoSoundPlaying) {
      image(displayTextImg, 486, 917);
    }
    // Special handling for skirt text
    if (currentlyDraggedSprite === foldedSkirt) {
      image(skirtTextImg, 486, 917);
    }
  }
}

function mouseReleased() {
  if (currentlyDraggedSprite) {
    // Stop clothes movement sound
    if (isClothesMovementPlaying) {
      clothesMovementSound.stop();
      isClothesMovementPlaying = false;
    }
    
    // Reset the currently dragged sprite
    if (currentlyDraggedSprite === shirt) {
      shirt.img = shirtImg;
    } else if (currentlyDraggedSprite === kimono) {
      kimono.img = kimonoImg;
      kimono.position = createVector(300,450);
      // Text visibility is now controlled by the sound state
    } else if (currentlyDraggedSprite === foldedSkirt) {
      foldedSkirt.img = foldedSkirtImg;
      foldedSkirt.position = createVector(400, 455);
      // Don't stop the skirt sound - let it play to completion
      // The isSkirtSoundPlaying flag will be reset when the sound ends naturally
    } else if (currentlyDraggedSprite === jean) {
      jean.img = foldedJeanImg;
    } else if (currentlyDraggedSprite === noSleeveShirt) {
      noSleeveShirt.img = noSleeveShirtImg;
    } else if (currentlyDraggedSprite === foldedYellow) {
      foldedYellow.img = foldedYellowImg;
    }
    
    currentlyDraggedSprite.isDraggable = false;
    currentlyDraggedSprite = null;
  }

  if (shirt.overlapping(targetSprite) &&
      kimono.overlapping(targetSprite) &&
      foldedSkirt.overlapping(targetSprite) &&
      foldedJean.overlapping(targetSprite)) {
    console.log("Done");
  }
}

function windowResized() {
  // Resize canvas to match window size
  resizeCanvas(windowWidth, windowHeight);
  
  // Update sprite positions relative to new window size if needed
  const centerX = windowWidth / 2;
  const centerY = windowHeight / 2;
  
  // Update positions of sprites relative to new center if needed
  if (shirt) shirt.position = createVector(centerX - 100, centerY - 50);
  if (kimono) kimono.position = createVector(centerX - 200, centerY + 50);
  // ... update other sprite positions as needed
}

function resetKimonoSound() {
  if (!kimonoSound.isPlaying()) {
    isKimonoSoundPlaying = false;
  }
}

function resetSkirtSound() {
  if (!skirtSound.isPlaying()) {
    isSkirtSoundPlaying = false;
  }
}
