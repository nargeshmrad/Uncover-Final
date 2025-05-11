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

let kimonoSound; // Kimono Music 
let isKimonoSoundPlaying = false;

let skirtSound; // Skirt Music
let isSkirtSoundPlaying = false;

let clothesMovementSound; // Clothes movement sound
let isClothesMovementPlaying = false;

let iMacWidth = 1920;
let iMacHeight = 1080;
let coef = 0.6;

let currentlyDraggedSprite = null;

//let kimonoSound; // Variable for the sound
//let displayTextImg; // Variable for the image

function preload() {
  backgroundImg = loadImage("assets/luggage/luggageBackground2.png");
  shirtImg = loadImage("assets/luggage/shirt.png");
  unfoldedShirtImg = loadImage("assets/luggage/unfoldedShirt.png");
  kimonoImg = loadImage("assets/luggage/foldedkimono.png");
  unfoldedKimonoImg = loadImage("assets/luggage/unfoldedKimono.png");
  kimonoSound = loadSound("assets/kimono.mp3"); // Load the sound
  // displayTextImg = loadImage("assets/text1.png"); // Load the image
  foldedSkirtImg = loadImage("assets/luggage/foldedSkirt.png");
  unfoldedSkirtImg = loadImage("assets/luggage/unfoldedSkirt.png");
  noSleeveShirtImg = loadImage("assets/luggage/foldedNoSleeve.png");
  unfoldedNoSleeveImg = loadImage("assets/luggage/unfoldedNoSleeve.png");
  foldedYellowImg = loadImage("assets/luggage/foldedYellow.png");
  unfoldedYellowImg = loadImage("assets/luggage/unfoldedYellowShirt.png");
  foldedJeanImg = loadImage("assets/luggage/jean.png");
  unfoldedJeanImg = loadImage("assets/luggage/unfoldedJean.png");
  displayTextImg = loadImage("assets/luggage/kimonoText.png"); // Load the image
  skirtTextImg = loadImage("assets/luggage/SkirtText.png");
  kimonoSound = loadSound("assets/kimono.mp3");
  clothesMovementSound = loadSound("assets/ClosetFirst/clothesMovement.mp3"); // Load clothes movement sound
  
  // Try to load the skirt sound from either location
  try {
    skirtSound = loadSound("assets/Skirt.m4a");
  } catch(e) {
    console.log("Trying alternate path for skirt sound");
    skirtSound = loadSound("assets/luggage/Skirt.m4a");
  }
}

function setup() {
  let canvas = createCanvas(iMacWidth * coef, iMacHeight * coef);
  canvas.parent("sketch-holder");
  allSprites.drag = 10;

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
  mouseSprite.x = mouseX;
  mouseSprite.y = mouseY;

  // Check sound states
  resetKimonoSound();
  resetSkirtSound();

  // imageMode(CENTER);
  let imageSize = iMacWidth * coef;
  if (iMacHeight * coef < iMacWidth * coef) {
    imageSize = iMacWidth * coef;
  } else {
    imageSize = iMacHeight * coef;
  }

  imageMode(CENTER);
  image(
    backgroundImg,
    (iMacWidth * coef) / 2,
    (iMacHeight * coef) / 2,
    imageSize,
    imageSize
  );

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
  resizeCanvas(iMacWidth * coef, iMacHeight * coef);
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
