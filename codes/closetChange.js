let iMacWidth = 1920;
let iMacHeight = 1080;
let coef = 0.6;
let backgroundImg, closet2Img, closet3Img;

// Sound effects
let clothesMovementSound, clothesDropSound;
let backgroundMusic;

// Volume levels for background music
const INITIAL_VOLUME = 0.3;
const CLOSET2_VOLUME = 0.5;
const CLOSET3_VOLUME = 0.7;

let longCoat, longRainCoat, longSleeve, shortSleeve;
let originalPositions = {};
let longCoatImg, longRainCoatImg, longSleeveImg, shortSleeveImg;
let folded1Img, folded2Img, folded3Img, folded4Img;
let targetZone1X = 270;
let targetZone1Y = 580;
let targetZoneWidth = 300;
let targetZoneHeight = 200;

// Mouse sprite and drag tracking
let mouseSprite;
let currentlyDraggedSprite = null;

// Fixed positions for folded clothes
let folded1X = 315;  // longSleeve
let folded1Y = 603;
let folded2X = 300;  // longCoat
let folded2Y = 615;
let folded3X = 550;  // longRainCoat
let folded3Y = 600;
let folded4X = 510;  // shortSleeve
let folded4Y = 600;

let allClothesDropped = false;
let closet2Timer = 0;
let closet3Timer = 0;
let fadeInOpacity2 = 0;
let fadeInOpacity3 = 0;
const FADE_DURATION = 1000; // 1 second fade duration

function handleLoadError(err) {
    console.error('Error loading asset:', err);
}

function preload() {
    // Load background image with error handling
    backgroundImg = loadImage('./assets/ClosetChange/Closet1.png', img => img, handleLoadError);
    closet2Img = loadImage('./assets/ClosetChange/Closet2.png', img => img, handleLoadError);
    closet3Img = loadImage('./assets/ClosetChange/Closet3.png', img => img, handleLoadError);
   
    // Load sound effects with error handling
    clothesMovementSound = loadSound('./assets/ClosetChange/clothesMovement.mp3', () => {}, handleLoadError);
    clothesDropSound = loadSound('./assets/ClosetChange/clothesDrop.mp3', () => {}, handleLoadError);
    backgroundMusic = loadSound('./assets/ClosetChange/lofiCloset.mp3', () => {}, handleLoadError);

    // Load hanged clothes images with error handling
    longCoatImg = loadImage('./assets/ClosetChange/longCoatHanged.png', img => img, handleLoadError);
    longRainCoatImg = loadImage('./assets/ClosetChange/longRainCoatHanged.png', img => img, handleLoadError);
    longSleeveImg = loadImage('./assets/ClosetChange/longSleeveHanged.png', img => img, handleLoadError);
    shortSleeveImg = loadImage('./assets/ClosetChange/shortSleeveHanged.png', img => img, handleLoadError);
    
    // Load folded clothes images with error handling
    folded1Img = loadImage('./assets/ClosetChange/folded1.png', img => img, handleLoadError);
    folded2Img = loadImage('./assets/ClosetChange/folded2.png', img => img, handleLoadError);
    folded3Img = loadImage('./assets/ClosetChange/folded3.png', img => img, handleLoadError);
    folded4Img = loadImage('./assets/ClosetChange/folded4.png', img => img, handleLoadError);
}

function setup() {
    // Ensure all assets are loaded before proceeding
    if (!backgroundImg || !closet2Img || !closet3Img || !backgroundMusic) {
        console.error('Essential assets not loaded. Retrying setup...');
        setTimeout(setup, 100);
        return;
    }

    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;

    // Dynamic scaling for optimal display
    let scaleFactor = Math.min(screenWidth / iMacWidth, screenHeight / iMacHeight);
    coef = scaleFactor; // Update the global coefficient for sprite scaling

    canvas = createCanvas(screenWidth, screenHeight);
    canvas.position(0, 0); // Align the canvas with the top-left corner
    canvas.parent("sketch-holder");
    allSprites.drag = 10;

    // Create invisible mouse sprite
    mouseSprite = new Sprite(0, 0, 1, 1);
    mouseSprite.visible = false;
    mouseSprite.collider = 'none';

    // Create sprites for each item with adjusted positions
    longCoat = createDraggableSprite('longCoat', 380, 405, 160, 350);
    longRainCoat = createDraggableSprite('longRainCoat', 465, 405, 180, 350);
    longSleeve = createDraggableSprite('longSleeve', 532, 400, 180, 350);
    shortSleeve = createDraggableSprite('shortSleeve', 325, 405, 180, 300);

    // Start background music with initial low volume
    backgroundMusic.setVolume(INITIAL_VOLUME);
    backgroundMusic.loop();
}

function createDraggableSprite(id, x, y, width, height) {
    let sprite = new Sprite(x, y, width, height);
    sprite.id = id;
    sprite.isDragging = false;
    sprite.collider = 'none';
    sprite.rotationLock = true;
    sprite.debug = false;  
    
    // Store original position
    originalPositions[id] = { x: x, y: y };

    // Assign images to sprites
    switch(id) {
        case 'longCoat':
            sprite.img = longCoatImg;
            sprite.scale = coef;
            break;
        case 'longRainCoat':
            sprite.img = longRainCoatImg;
            sprite.scale = coef;
            break;
        case 'longSleeve':
            sprite.img = longSleeveImg;
            sprite.scale = coef;
            break;
        case 'shortSleeve':
            sprite.img = shortSleeveImg;
            sprite.scale = coef;
            break;
    }

    return sprite;
}

function draw() {
    clear();
    
    // Update mouse sprite position
    mouseSprite.x = mouseX;
    mouseSprite.y = mouseY;
    
    // Handle cursor style
    document.body.style.cursor = 'default'; // reset
    let sprites = [longCoat, longRainCoat, longSleeve, shortSleeve];
    for (let sprite of sprites) {
        if (sprite.overlapping(mouseSprite)) {
            document.body.style.cursor = 'pointer';
            break;
        }
    }
    
    if (!allClothesDropped || millis() < closet2Timer) {
        // Show initial background
        image(backgroundImg, 0, 0, width, height);
    } else if (millis() >= closet2Timer && millis() < closet3Timer) {
        // Show Closet2 with fade in
        image(backgroundImg, 0, 0, width, height); // Draw background first
        
        // Calculate fade in opacity for Closet2
        let fadeProgress = (millis() - closet2Timer) / FADE_DURATION;
        fadeInOpacity2 = min(255, fadeProgress * 255); // Cap at 255
        
        // Increase music volume when Closet2 starts fading in
        if (fadeProgress <= 1) {
            let volumeTransition = lerp(INITIAL_VOLUME, CLOSET2_VOLUME, fadeProgress);
            backgroundMusic.setVolume(volumeTransition);
        }
        
        // Apply fade in effect to Closet2
        tint(255, fadeInOpacity2);
        image(closet2Img, 0, 0, width, height);
        noTint(); // Reset tint
    } else if (millis() >= closet3Timer) {
        // Show Closet3 with fade in
        image(closet2Img, 0, 0, width, height); // Draw Closet2 as background
        
        // Calculate fade in opacity for Closet3
        let fadeProgress = (millis() - closet3Timer) / FADE_DURATION;
        fadeInOpacity3 = min(255, fadeProgress * 255); // Cap at 255
        
        // Increase music volume when Closet3 starts fading in
        if (fadeProgress <= 1) {
            let volumeTransition = lerp(CLOSET2_VOLUME, CLOSET3_VOLUME, fadeProgress);
            backgroundMusic.setVolume(volumeTransition);
        }
        
        // Apply fade in effect to Closet3
        tint(255, fadeInOpacity3);
        image(closet3Img, 0, 0, width, height);
        noTint(); // Reset tint
    }

    // Draw target zones
    noStroke();
}

function mousePressed() {
    mouseSprite.x = mouseX;
    mouseSprite.y = mouseY;

    let sprites = [longCoat, longRainCoat, longSleeve, shortSleeve];
    for (let sprite of sprites) {
        if (sprite.overlapping(mouseSprite)) {
            currentlyDraggedSprite = sprite;
            sprite.isDragging = true;
            document.body.style.cursor = 'pointer';
            // Play movement sound when starting to drag
            clothesMovementSound.play();
            break;
        }
    }
}

function mouseDragged() {
    // Update mouse sprite position
    mouseSprite.x = mouseX;
    mouseSprite.y = mouseY;
    
    // Move the currently dragged sprite
    if (currentlyDraggedSprite) {
        currentlyDraggedSprite.x = mouseX;
        currentlyDraggedSprite.y = mouseY;
    }
}

function mouseReleased() {
    if (!currentlyDraggedSprite) return;
    
    let droppedCount = 0;
    
    // Handle the currently dragged sprite
    currentlyDraggedSprite.isDragging = false;
    document.body.style.cursor = 'default';
    
    // Stop movement sound and play drop sound
    clothesMovementSound.stop();
    clothesDropSound.play();
    
    // Check if sprite is in target zone
    let inTargetZone = false;
    if (currentlyDraggedSprite.x > targetZone1X && 
        currentlyDraggedSprite.x < targetZone1X + targetZoneWidth &&
        currentlyDraggedSprite.y > targetZone1Y && 
        currentlyDraggedSprite.y < targetZone1Y + targetZoneHeight) {
        inTargetZone = true;
    }

    if (!inTargetZone) {
        currentlyDraggedSprite.x = originalPositions[currentlyDraggedSprite.id].x;
        currentlyDraggedSprite.y = originalPositions[currentlyDraggedSprite.id].y;
    } else {
        // Change to folded version and move to fixed position
        switch (currentlyDraggedSprite) {
            case longSleeve:
                currentlyDraggedSprite.img = folded1Img;
                currentlyDraggedSprite.x = folded1X;
                currentlyDraggedSprite.y = folded1Y;
                break;
            case longCoat:
                currentlyDraggedSprite.img = folded2Img;
                currentlyDraggedSprite.x = folded2X;
                currentlyDraggedSprite.y = folded2Y;
                break;
            case longRainCoat:
                currentlyDraggedSprite.img = folded3Img;
                currentlyDraggedSprite.x = folded3X;
                currentlyDraggedSprite.y = folded3Y;
                break;
            case shortSleeve:
                currentlyDraggedSprite.img = folded4Img;
                currentlyDraggedSprite.x = folded4X;
                currentlyDraggedSprite.y = folded4Y;
                break;
        }
        currentlyDraggedSprite.scale = coef;
    }
    
    // Count clothes that are in folded positions
    [longCoat, longRainCoat, longSleeve, shortSleeve].forEach(sprite => {
        if (sprite.x === folded1X && sprite.y === folded1Y ||
            sprite.x === folded2X && sprite.y === folded2Y ||
            sprite.x === folded3X && sprite.y === folded3Y ||
            sprite.x === folded4X && sprite.y === folded4Y) {
            droppedCount++;
        }
    });
    
    // Check if all clothes are dropped
    if (droppedCount === 4 && !allClothesDropped) {
        allClothesDropped = true;
        closet2Timer = millis() + 4000;
        closet3Timer = closet2Timer + 4000;
    }
    
    // Reset currently dragged sprite
    currentlyDraggedSprite = null;
}
