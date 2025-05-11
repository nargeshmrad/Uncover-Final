let ClosetImg;
let socksInFeetImg, shirtBodyImg, shortPantOnBodyImg, OverallSelectedImg;
let socksSelectedImg, SocksClosetImg, shoesImg, foldedShortPantImg;
let foldedLongPantImg, ShirtHangedImg, topHangedImg, OverallInClosetImg;
let longPantImg;
let shirt, shirtWearZone;  
let originalShirtX = 360;  
let originalShirtY = 209;  
let isShirtWorn = false;


let iMacWidth = 1920;
let iMacHeight = 1080;
let coef = 0.6;
let longPants, targetSprite, mouseSprite, socks, socksWearZone, overall, overallWearZone, shortPants, shortPantsWearZone, shoes, shoesWearZone, topClothing, topWearZone;
let dropZone, foldedDropZone;
let isPantInDropZone = false;
let isSocksWorn = false;

// Track what's being worn
let topWornItem = null;  // Can be 'shirt', 'top', or 'overall'
let bottomWornItem = null;  // Can be 'longPants', 'shortPants', or 'overall'

let pantWidth, pantHeight;
let originalPantX = 545;
let originalPantY = 450;
let foldedPantWidth, foldedPantHeight;
let originalSocksX = 369;
let originalSocksY = 503;
let socksWidth, socksHeight;


// Add new position and size variables
let originalOverallX = 535;
let originalOverallY = 210;
let overallWidth, overallHeight;


let originalShortPantX = 555;
let originalShortPantY = 515;
let shortPantWidth, shortPantHeight;


let originalShoesX = 369;
let originalShoesY = 570;
let shoesWidth, shoesHeight;


let originalTopX = 360;
let originalTopY = 290;
let topWidth, topHeight;


// Add background music variable
let bgMusic;
let clothesSound;  // Add clothes movement sound variable
let clothesDropSound;  // Add clothes drop sound variable
let cropTopSound;  // Add crop top sound variable
let shortPantSound;  // Add short pants sound variable
let sneakersSound;  // Add sneakers sound variable


function preload() {
    // Load sounds
    cropTopSound = loadSound("../assets/ClosetGatheringScene/CropTop.m4a");
    shortPantSound = loadSound("../assets/ClosetGatheringScene/ShortPant.m4a");
    sneakersSound = loadSound("../assets/ClosetGatheringScene/Sneakers.m4a");
    
    // Load images
    ClosetImg = loadImage("../assets/ClosetGatheringScene/Closet.png");
    socksInFeetImg = loadImage("../assets/ClosetGatheringScene/socksInFeet.png");
   
    // Load shoes image
    shoesImg = loadImage("../assets/ClosetGatheringScene/shoes.png", img => {
        shoesWidth = img.width * coef;
        shoesHeight = img.height * coef;
    });


    // Load top images
    topHangedImg = loadImage("../assets/ClosetGatheringScene/topHanged.png", img => {
        topWidth = img.width * coef;
        topHeight = img.height * coef;
    });
    TopOnBodyImg = loadImage("../assets/ClosetGatheringScene/TopOnBody.png");


    // Load short pants images
    foldedShortPantImg = loadImage("../assets/ClosetGatheringScene/foldedShortPant.png", img => {
        shortPantWidth = img.width * coef;
        shortPantHeight = img.height * coef;
    });
    shortPantOnBodyImg = loadImage("../assets/ClosetGatheringScene/shortPantOnBody.png");
    shirtBodyImg = loadImage("../assets/ClosetGatheringScene/shirtBody.png");
    shortPantOnBodyImg = loadImage("../assets/ClosetGatheringScene/shortPantOnBody.png");
    OverallSelectedImg = loadImage("../assets/ClosetGatheringScene/OverallSelected.png");
    socksSelectedImg = loadImage("../assets/ClosetGatheringScene/socksSelected.png");
    SocksClosetImg = loadImage("../assets/ClosetGatheringScene/SocksCloset.png", img => {
        socksWidth = img.width * coef;
        socksHeight = img.height * coef;
    });
    foldedLongPantImg = loadImage("../assets/ClosetGatheringScene/foldedLongPant.png", img => {
        foldedPantWidth = img.width * coef;
        foldedPantHeight = img.height * coef;
    });
    ShirtHangedImg = loadImage("../assets/ClosetGatheringScene/ShirtHanged.png");
    topHangedImg = loadImage("../assets/ClosetGatheringScene/topHanged.png");
    OverallInClosetImg = loadImage("../assets/ClosetGatheringScene/OverallInCloset.png", img => {
        overallWidth = img.width * coef;
        overallHeight = img.height * coef;
    });
    longPantImg = loadImage("../assets/ClosetGatheringScene/long Pant.png", img => {
        pantWidth = img.width * coef;
        pantHeight = img.height * coef;
    });
   
    // Load new images with size calculations
    foldedShortPantImg = loadImage("../assets/ClosetGatheringScene/foldedShortPant.png", img => {
        shortPantWidth = img.width * coef;
        shortPantHeight = img.height * coef;
    });
   
    shoesImg = loadImage("../assets/ClosetGatheringScene/shoes.png", img => {
        shoesWidth = img.width * coef;
        shoesHeight = img.height * coef;
    });
   
    topHangedImg = loadImage("../assets/ClosetGatheringScene/topHanged.png", img => {
        topWidth = img.width * coef;
        topHeight = img.height * coef;
    });


    // Load background music
    bgMusic = loadSound("../assets/ClosetGatheringScene/ClosetAmbience.mp3");
    // Load clothes movement sound
    clothesSound = loadSound("../assets/ClosetGatheringScene/clothesMovement.mp3");
    // Load clothes drop sound
    clothesDropSound = loadSound("../assets/ClosetGatheringScene/clothesDrop.mp3");
}


function setup() {
    let canvas = createCanvas(iMacWidth * coef, iMacHeight * coef);
    canvas.parent("sketch-holder");
    allSprites.drag = 10;


    // Create overall sprite
    overall = new Sprite(originalOverallX, originalOverallY, 200, 300);
    overall.img = OverallInClosetImg;
    overall.scale = coef;
    overall.collider = 'none';
    overall.rotationLock = true;
    overall.isDraggable = true;
    overall.isDragging = false;
    overall.debug = true;




    // Start playing background music
    bgMusic.loop();
    bgMusic.setVolume(0.5);  // Set volume to 50%


    // Create drop zone sprite for wearing the pants
    dropZone = new Sprite(768, 450, pantWidth || 144, pantHeight || 297, 'static');
    dropZone.visible = false;
    dropZone.collider = 'static';


    // Create drop zone for folded pants position
    foldedDropZone = new Sprite(originalPantX, originalPantY, foldedPantWidth || 100, foldedPantHeight || 100, 'static');
    foldedDropZone.visible = false;
    foldedDropZone.collider = 'static';


    // Create wear zone for socks - adjusted position and size
    socksWearZone = new Sprite(768, 570, 100, 50, 'static');
    socksWearZone.visible = false;


    // Create wear zone for shirt
    shirtWearZone = new Sprite(768, 335, 100, 150, 'static');
    shirtWearZone.visible = false;


    // Create socks sprite
    socks = new Sprite(originalSocksX, originalSocksY, 80, 40);
    if (SocksClosetImg) {
        socks.img = SocksClosetImg;
        socks.scale = coef;
    }
    socks.collider = 'none';
    socks.rotationLock = true;


    // Create long pants sprite
    longPants = new Sprite(originalPantX, originalPantY, foldedPantWidth || 100, foldedPantHeight || 100);
    if (foldedLongPantImg) {
        longPants.img = foldedLongPantImg;
        longPants.scale = coef;
    }
    longPants.collider = 'none';
    longPants.rotationLock = true;
    longPants.isDraggable = false;
    longPants.isDragging = false;


    // Create overall wear zone
    overallWearZone = new Sprite(768, 355, 100, 200, 'static');
    overallWearZone.visible = false;


    // Create short pants wear zone
    shortPantsWearZone = new Sprite(768, 415, 100, 150, 'static');
    shortPantsWearZone.visible = false;


    // Create short pants sprite
    shortPants = new Sprite(originalShortPantX, originalShortPantY, 150, 200);
    if (foldedShortPantImg) {
        shortPants.img = foldedShortPantImg;
        shortPants.scale = coef;
    }
    shortPants.collider = 'none';
    shortPants.rotationLock = true;
    shortPants.isDraggable = true;
    shortPants.isDragging = false;


    // Create shoes wear zone
    shoesWearZone = new Sprite(768, 570, 100, 50, 'static');
    shoesWearZone.visible = false;


    // Create shoes sprite
    shoes = new Sprite(originalShoesX, originalShoesY, 100, 50);
    if (shoesImg) {
        shoes.img = shoesImg;
        shoes.scale = coef;
    }
    shoes.collider = 'none';
    shoes.rotationLock = true;
    shoes.isDraggable = true;
    shoes.isDragging = false;


    // Create shirt sprite
    shirt = new Sprite(originalShirtX, originalShirtY, 100, 150);
    if (ShirtHangedImg) {
        shirt.img = ShirtHangedImg;
        shirt.scale = coef;
    }
    shirt.collider = 'none';
    shirt.rotationLock = true;
    shirt.isDraggable = true;
    shirt.isDragging = false;


    // Create top wear zone
    topWearZone = new Sprite(768, 315, 100, 150, 'static');
    topWearZone.visible = false;


    // Create top sprite
    topClothing = new Sprite(originalTopX, originalTopY, 100, 150);
    if (topHangedImg) {
        topClothing.img = topHangedImg;
        topClothing.scale = coef;
    }
    topClothing.collider = 'none';
    topClothing.rotationLock = true;
    topClothing.isDraggable = true;
    topClothing.isDragging = false;


    // Create mouse sprite
    mouseSprite = new Sprite(0, 0, 10, 10);
    mouseSprite.visible = false;
    mouseSprite.collider = 'none';
}


function draw() {
    clear();
    background(255);
   
    // Draw the closet background
    if (ClosetImg) {
        image(ClosetImg, 0, 0, width, height);
    }


    mouseSprite.x = mouseX;
    mouseSprite.y = mouseY;


    let imageSize = iMacWidth * coef;
    if (iMacHeight * coef < iMacWidth * coef) {
        imageSize = iMacWidth * coef;
    } else {
        imageSize = iMacHeight * coef;
    }


    imageMode(CENTER);
    if (ClosetImg) {
        image(
            ClosetImg,
            (iMacWidth * coef) / 2,
            (iMacHeight * coef) / 2,
            imageSize,
            imageSize
        );
    }


    // Check if mouse is over the pants
    if (longPants) {
        let mouseOverPants = dist(mouseX, mouseY, longPants.x, longPants.y) < longPants.width/2;
        if (mouseOverPants || longPants.isDragging) {
            longPants.isDraggable = true;
        } else {
            longPants.isDraggable = false;
        }


        // Check if pants are near either drop zone
        let distToWearZone = dist(longPants.x, longPants.y, dropZone.x, dropZone.y);
        let magneticRange = 100; // Adjust this value to change the magnetic range


        if (longPants.isDragging) {
            if (distToWearZone < magneticRange) {
                // Create magnetic effect when near wear zone
                let pullStrength = map(distToWearZone, 0, magneticRange, 0.3, 0);
                longPants.x = lerp(longPants.x, dropZone.x, pullStrength);
                longPants.y = lerp(longPants.y, dropZone.y, pullStrength);


            } else if (longPants.overlaps(dropZone)) {
            } else if (longPants.overlaps(foldedDropZone)) {
            } else {
            }
        }
    }


    // Check if mouse is over the socks
    if (socks) {  
        let mouseOverSocks = dist(mouseX, mouseY, socks.x, socks.y) < socks.width/2;
       
        // Make socks draggable when mouse is over or already dragging
        if (mouseOverSocks || socks.isDragging) {
            socks.isDraggable = true;
        } else if (!socks.isDragging) {
            socks.isDraggable = false;
        }


        // Visual feedback for wear zone
        if (socks.isDragging) {
            let d = dist(socks.x, socks.y, socksWearZone.x, socksWearZone.y);
        }
    }


    // Check if mouse is over the shirt
    if (shirt) {
        let mouseOverShirt = dist(mouseX, mouseY, shirt.x, shirt.y) < shirt.width/2;
       
        // Make shirt draggable when mouse is over or already dragging
        if (mouseOverShirt || shirt.isDragging) {
            shirt.isDraggable = true;
        } else if (!shirt.isDragging) {
            shirt.isDraggable = false;
        }


        // Visual feedback for shirt wear zone
        if (shirt.isDragging) {
            let d = dist(shirt.x, shirt.y, shirtWearZone.x, shirtWearZone.y);
        }
    }


    if (isPantInDropZone) {
        fill(0);
        textSize(24);
        text("Perfect! The pants are in place!", 700, 830);
    }
}


function mousePressed() {
    // Check if mouse is over the top
    if (topClothing && !topClothing.isDragging) {
        let mouseOverTop = dist(mouseX, mouseY, topClothing.x, topClothing.y) < topClothing.width/2;
        if (mouseOverTop) {
            topClothing.isDragging = true;
            // Change to body image when dragging starts
            if (TopOnBodyImg) {
                topClothing.img = TopOnBodyImg;
                topClothing.scale = coef;
            }
            // Play clothes sound when starting to drag
            if (!clothesSound.isPlaying()) {
                clothesSound.play();
                clothesSound.setVolume(0.5);
            }
        }
    }


    // Check if mouse is over the shirt
    if (shirt && !shirt.isDragging) {
        let mouseOverShirt = dist(mouseX, mouseY, shirt.x, shirt.y) < shirt.width/2;
        if (mouseOverShirt) {
            shirt.isDragging = true;
            // Change to body image when dragging starts
            if (shirtBodyImg) {
                shirt.img = shirtBodyImg;
                shirt.scale = coef;
            }
            // Play clothes sound when starting to drag
            if (!clothesSound.isPlaying()) {
                clothesSound.play();
                clothesSound.setVolume(0.5);
            }
        }
    }


    // Check if mouse is over the shoes
    if (shoes && !shoes.isDragging) {
        let mouseOverShoes = dist(mouseX, mouseY, shoes.x, shoes.y) < shoes.width/2;
        if (mouseOverShoes) {
            shoes.isDragging = true;
            // Play clothes sound when starting to drag
            if (!clothesSound.isPlaying()) {
                clothesSound.play();
                clothesSound.setVolume(0.5);
            }
        }
    }


    // Check if mouse is over the short pants
    if (shortPants && !shortPants.isDragging) {
        let mouseOverShortPants = dist(mouseX, mouseY, shortPants.x, shortPants.y) < shortPants.width/2;
        if (mouseOverShortPants) {
            shortPants.isDragging = true;
            // Change to body image when dragging starts
            if (shortPantOnBodyImg) {
                shortPants.img = shortPantOnBodyImg;
                shortPants.scale = coef;
            }
            // Play clothes sound when starting to drag
            if (!clothesSound.isPlaying()) {
                clothesSound.play();
                clothesSound.setVolume(0.5);
            }
        }
    }


    // Check if mouse is over the overall
    if (overall && !overall.isDragging) {
        let mouseOverOverall = dist(mouseX, mouseY, overall.x, overall.y) < overall.width/2;
        if (mouseOverOverall) {
            overall.isDragging = true;
            // Change to selected image when dragging starts
            if (OverallSelectedImg) {
                overall.img = OverallSelectedImg;
                overall.scale = coef;
            }
            // Play clothes sound when starting to drag
            if (!clothesSound.isPlaying()) {
                clothesSound.play();
                clothesSound.setVolume(0.5);
            }
        }
    }


    // Check if mouse is over the pants
    if (longPants) {
        let mouseOverPants = dist(mouseX, mouseY, longPants.x, longPants.y) < longPants.width/2;
        if (mouseOverPants) {
            longPants.isDragging = true;
            longPants.isDraggable = true;


            // Change to unfolded image immediately
            if (longPantImg) {
                longPants.img = longPantImg;
                longPants.scale = coef;
                longPants.width = pantWidth;
                longPants.height = pantHeight;
            }
            // Play clothes sound when starting to drag
            if (!clothesSound.isPlaying()) {
                clothesSound.loop();
                clothesSound.setVolume(0.5);
            }
        }
    }


    // Check if mouse is over the socks
    if (socks && !isSocksWorn) {
        let mouseOverSocks = dist(mouseX, mouseY, socks.x, socks.y) < socks.width/2;
        if (mouseOverSocks) {
            socks.isDragging = true;
            socks.isDraggable = true;
            // Change to selected image when clicked
            if (socksSelectedImg) {
                socks.img = socksSelectedImg;
                socks.scale = coef;
            }
            // Play clothes sound when starting to drag
            if (!clothesSound.isPlaying()) {
                clothesSound.loop();
                clothesSound.setVolume(0.5);
            }
        }
    }


    // Check if mouse is over the shirt
    if (shirt && !isShirtWorn) {
        let mouseOverShirt = dist(mouseX, mouseY, shirt.x, shirt.y) < shirt.width/2;
        if (mouseOverShirt) {
            shirt.isDragging = true;
            shirt.isDraggable = true;
           
            // Change to body image immediately when dragging starts
            if (shirtBodyImg) {
                shirt.img = shirtBodyImg;
                shirt.scale = coef;
                shirt.width = shirtBodyImg.width * coef;
                shirt.height = shirtBodyImg.height * coef;
            }
            // Play clothes sound when starting to drag
            if (!clothesSound.isPlaying()) {
                clothesSound.loop();
                clothesSound.setVolume(0.5);
            }
        }
    }
}


function mouseDragged() {
    if (topClothing && topClothing.isDragging) {
        topClothing.x = mouseX;
        topClothing.y = mouseY;
    }


    if (shoes && shoes.isDragging) {
        shoes.x = mouseX;
        shoes.y = mouseY;
    }


    if (shortPants && shortPants.isDragging) {
        shortPants.x = mouseX;
        shortPants.y = mouseY;
    }


    if (overall && overall.isDragging) {
        overall.x = mouseX;
        overall.y = mouseY;
    }


    if (longPants && longPants.isDragging) {
        longPants.x = mouseX;
        longPants.y = mouseY;
    }


    if (socks && socks.isDragging) {  
        socks.x = mouseX;
        socks.y = mouseY;
    }


    if (shirt && shirt.isDragging) {
        shirt.x = mouseX;
        shirt.y = mouseY;
    }
}


function mouseReleased() {
    // Handle top release
    if (topClothing && topClothing.isDragging) {
        topClothing.isDragging = false;

        // Get distance to wear zone
        let d = dist(topClothing.x, topClothing.y, topWearZone.x, topWearZone.y);
       
        // Check if close enough to wear zone
        if (d < 50) {
            // If something else from top category is worn, return it to original position
            if (topWornItem === 'shirt') {
                shirt.x = originalShirtX;
                shirt.y = originalShirtY;
                shirt.img = ShirtHangedImg;
                shirt.scale = coef;
                isShirtWorn = false;
            } else if (topWornItem === 'overall') {
                overall.x = originalOverallX;
                overall.y = originalOverallY;
                overall.img = OverallInClosetImg;
                overall.scale = coef;
                // If overall was worn, also clear bottom category
                if (bottomWornItem === 'overall') {
                    bottomWornItem = null;
                }
            }

            // Place in wear zone
            topClothing.x = topWearZone.x;
            topClothing.y = topWearZone.y;
            if (TopOnBodyImg) {
                topClothing.img = TopOnBodyImg;
                topClothing.scale = coef;
            }
            // Update what's being worn
            topWornItem = 'top';

            if (!clothesDropSound.isPlaying()) {
                clothesDropSound.play();
            }

            // Show dialogue text for crop top
            const dialogueText = document.getElementById('dialogueText');
            dialogueText.textContent = "Getting arrested in the street, a comment at a family gathering, someone calling my parents, then a fight at home.";
            dialogueText.style.display = 'block';
            
            // Play crop top sound and hide dialogue when it ends
            if (!cropTopSound.isPlaying()) {
                cropTopSound.play();
                // Add event listener for when sound ends
                cropTopSound.onended(() => {
                    dialogueText.style.display = 'none';
                });
            }
        } else {
            // Return to original position and image
            topClothing.x = originalTopX;
            topClothing.y = originalTopY;
            topClothing.img = topHangedImg;
            topClothing.scale = coef;
            // Clear worn state if this top was worn
            if (topWornItem === 'top') {
                topWornItem = null;
            }
        }
    }


    // Handle shoes release
    if (shoes && shoes.isDragging) {
        shoes.isDragging = false;


        // Get distance to wear zone
        let d = dist(shoes.x, shoes.y, shoesWearZone.x, shoesWearZone.y);
       
        // Check if close enough to wear zone
        if (d < 50) {
            // Place in wear zone
            shoes.x = shoesWearZone.x;
            shoes.y = shoesWearZone.y;
            if (!clothesDropSound.isPlaying()) {
                clothesDropSound.play();
            }

            // Show dialogue text for sneakers
            const dialogueText = document.getElementById('dialogueText');
            dialogueText.textContent = "It's funny — I can wear these now, no problem. But that other time at school, they sent me home just because my shoes were 'too attention-grabbing'.";
            dialogueText.style.display = 'block';
            
            // Play sneakers sound and hide dialogue when it ends
            if (!sneakersSound.isPlaying()) {
                sneakersSound.play();
                sneakersSound.onended(() => {
                    dialogueText.style.display = 'none';
                });
            }
        } else {
            // Return to original position
            shoes.x = originalShoesX;
            shoes.y = originalShoesY;
        }
    }


    // Handle short pants release
    if (shortPants && shortPants.isDragging) {
        shortPants.isDragging = false;

        // Get distance to wear zone
        let d = dist(shortPants.x, shortPants.y, shortPantsWearZone.x, shortPantsWearZone.y);
       
        // Check if close enough to wear zone
        if (d < 50) {
            // If something else from bottom category is worn, return it to original position
            if (bottomWornItem === 'longPants') {
                longPants.x = originalPantX;
                longPants.y = originalPantY;
                longPants.img = foldedLongPantImg;
                longPants.scale = coef;
            } else if (bottomWornItem === 'overall') {
                overall.x = originalOverallX;
                overall.y = originalOverallY;
                overall.img = OverallInClosetImg;
                overall.scale = coef;
            }

            // Place short pants in wear zone
            shortPants.x = shortPantsWearZone.x;
            shortPants.y = shortPantsWearZone.y;
            if (shortPantOnBodyImg) {
                shortPants.img = shortPantOnBodyImg;
                shortPants.scale = coef;
            }
            // Update what's being worn
            bottomWornItem = 'shortPants';

            if (!clothesDropSound.isPlaying()) {
                clothesDropSound.play();
            }

            // Show dialogue text for short pants
            const dialogueText = document.getElementById('dialogueText');
            dialogueText.textContent = "It's boiling out. I want to wear these so bad — but I can't in the street. One day they don't care, the next day they arrest you.";
            dialogueText.style.display = 'block';
            
            // Play short pants sound and hide dialogue when it ends
            if (!shortPantSound.isPlaying()) {
                shortPantSound.play();
                shortPantSound.onended(() => {
                    dialogueText.style.display = 'none';
                });
            }
        } else {
            // Return to original position and image
            shortPants.x = originalShortPantX;
            shortPants.y = originalShortPantY;
            shortPants.img = foldedShortPantImg;
            shortPants.scale = coef;
            if (bottomWornItem === 'shortPants') {
                bottomWornItem = null;
            }
        }
    }


    // Handle overall release
    if (overall && overall.isDragging) {
        overall.isDragging = false;
        overall.isDraggable = false;


        // Get distance to wear zone
        let d = dist(overall.x, overall.y, overallWearZone.x, overallWearZone.y);
       
        // Check if close enough to wear zone
        if (d < 50) {
            // If something else is worn in either category, return it to original position
            if (topWornItem === 'shirt') {
                shirt.x = originalShirtX;
                shirt.y = originalShirtY;
                shirt.img = ShirtHangedImg;
                shirt.scale = coef;
                isShirtWorn = false;
            } else if (topWornItem === 'top') {
                topClothing.x = originalTopX;
                topClothing.y = originalTopY;
                topClothing.img = topHangedImg;
                topClothing.scale = coef;
            }

            if (bottomWornItem === 'longPants') {
                longPants.x = originalPantX;
                longPants.y = originalPantY;
                longPants.img = foldedLongPantImg;
                longPants.scale = coef;
                isPantInDropZone = false;
            } else if (bottomWornItem === 'shortPants') {
                shortPants.x = originalShortPantX;
                shortPants.y = originalShortPantY;
                shortPants.img = foldedShortPantImg;
                shortPants.scale = coef;
            }

            // Place overall in wear zone
            overall.x = overallWearZone.x;
            overall.y = overallWearZone.y;
            if (OverallSelectedImg) {
                overall.img = OverallSelectedImg;
                overall.scale = coef;
            }
            // Update what's being worn in both categories
            topWornItem = 'overall';
            bottomWornItem = 'overall';

            if (!clothesDropSound.isPlaying()) {
                clothesDropSound.play();
            }

            // Show dialogue text for overall
            const dialogueText = document.getElementById('dialogueText');
            dialogueText.textContent = "Last time I wore something this short, I didn't even make it to the door. Dad told me I'd get picked up by the police.";
            dialogueText.style.display = 'block';
            
            // Hide dialogue after 5 seconds
            setTimeout(() => {
                dialogueText.style.display = 'none';
            }, 5000);
        } else {
            // Return to original position and image
            overall.x = originalOverallX;
            overall.y = originalOverallY;
            overall.img = OverallInClosetImg;
            overall.scale = coef;
            // Clear worn states if this overall was worn
            if (topWornItem === 'overall') {
                topWornItem = null;
                bottomWornItem = null;
            }
        }
    }


    if (longPants) {
        longPants.isDragging = false;
       
        // Check for overlap with either zone
        let distToWearZone = dist(longPants.x, longPants.y, dropZone.x, dropZone.y);
        let magneticRange = 100; // Same range as in draw()
        let inWearZone = longPants.overlaps(dropZone) || distToWearZone < magneticRange;
       
        if (longPants.isDraggable) {
            if (inWearZone) {
                // If something else from bottom category is worn, return it to original position
                if (bottomWornItem === 'shortPants') {
                    shortPants.x = originalShortPantX;
                    shortPants.y = originalShortPantY;
                    shortPants.img = foldedShortPantImg;
                    shortPants.scale = coef;
                } else if (bottomWornItem === 'overall') {
                    overall.x = originalOverallX;
                    overall.y = originalOverallY;
                    overall.img = OverallInClosetImg;
                    overall.scale = coef;
                    // If overall was worn, also clear top category
                    if (topWornItem === 'overall') {
                        topWornItem = null;
                    }
                }

                // Snap to wear zone
                longPants.x = dropZone.x;
                longPants.y = dropZone.y;
                isPantInDropZone = true;
                if (longPantImg) {
                    longPants.img = longPantImg;
                    longPants.scale = coef;
                    longPants.width = pantWidth;
                    longPants.height = pantHeight;
                }
                // Update what's being worn
                bottomWornItem = 'longPants';

                if (!clothesDropSound.isPlaying()) {
                    clothesDropSound.play();
                }

                // Show dialogue text for long pants
                const dialogueText = document.getElementById('dialogueText');
                dialogueText.textContent = "It's kinda hot, but at least no one's gonna comment on my legs or anything.";
                dialogueText.style.display = 'block';
                
                // Hide dialogue after 5 seconds
                setTimeout(() => {
                    dialogueText.style.display = 'none';
                }, 5000);
            } else {
                // Return to storage zone
                longPants.x = foldedDropZone.x;
                longPants.y = foldedDropZone.y;
                if (foldedLongPantImg) {
                    longPants.img = foldedLongPantImg;
                    longPants.scale = coef;
                    longPants.width = foldedPantWidth;
                    longPants.height = foldedPantHeight;
                }
                isPantInDropZone = false;
                // Clear worn state if these pants were worn
                if (bottomWornItem === 'longPants') {
                    bottomWornItem = null;
                }
            }
        }
    }


    if (shirt && shirt.isDragging) {
        shirt.isDragging = false;

        // Get distance to wear zone
        let d = dist(shirt.x, shirt.y, shirtWearZone.x, shirtWearZone.y);
       
        // Check if close enough to wear zone
        if (d < 50) {
            // If something else from top category is worn, return it to original position
            if (topWornItem === 'top') {
                topClothing.x = originalTopX;
                topClothing.y = originalTopY;
                topClothing.img = topHangedImg;
                topClothing.scale = coef;
            } else if (topWornItem === 'overall') {
                overall.x = originalOverallX;
                overall.y = originalOverallY;
                overall.img = OverallInClosetImg;
                overall.scale = coef;
                // If overall was worn, also clear bottom category
                if (bottomWornItem === 'overall') {
                    bottomWornItem = null;
                }
            }

            // Place shirt in wear zone
            shirt.x = shirtWearZone.x;
            shirt.y = shirtWearZone.y;
            if (shirtBodyImg) {
                shirt.img = shirtBodyImg;
                shirt.scale = coef;
            }
            // Update what's being worn
            topWornItem = 'shirt';

            if (!clothesDropSound.isPlaying()) {
                clothesDropSound.play();
            }
            isShirtWorn = true;

            // Show dialogue text
            const dialogueText = document.getElementById('dialogueText');
            dialogueText.textContent = "If I wear this, no one's gonna say anything — and I still kind of feel like myself";
            dialogueText.style.display = 'block';
            
            // Hide dialogue after 5 seconds
            setTimeout(() => {
                dialogueText.style.display = 'none';
            }, 5000);
        } else {
            // Return to original position and image
            shirt.x = originalShirtX;
            shirt.y = originalShirtY;
            shirt.img = ShirtHangedImg;
            shirt.scale = coef;
            isShirtWorn = false;
            // Clear worn state if this shirt was worn
            if (topWornItem === 'shirt') {
                topWornItem = null;
            }
        }
    }


    if (socks && socks.isDragging) {  
        socks.isDragging = false;
       
        // Get the distance between socks and wear zone centers
        let d = dist(socks.x, socks.y, socksWearZone.x, socksWearZone.y);
       
        // Check if socks are close enough to the wear zone
        if (d < 35) {  
            // Place in feet zone
            socks.x = socksWearZone.x;
            socks.y = socksWearZone.y-13;  
            if (socksInFeetImg) {
                socks.img = socksInFeetImg;
                socks.scale = coef;
                socks.width = socksInFeetImg.width * coef;
                socks.height = socksInFeetImg.height * coef;
            }
            isSocksWorn = true;
            if (!isSocksWorn) {
                clothesDropSound.play();
            }
        } else {
            // Return to storage
            socks.x = originalSocksX;
            socks.y = originalSocksY;
            socks.img = SocksClosetImg;
            socks.scale = coef;
            isSocksWorn = false;
        }
    }


    // Handle shirt dropping
    if (shirt && shirt.isDragging) {
        shirt.isDragging = false;
       
        // Get distance to wear zone
        let d = dist(shirt.x, shirt.y, shirtWearZone.x, shirtWearZone.y);
       
        // Check if close enough to wear zone
        if (d < 35) {
            // Place in shirt zone with offset
            shirt.x = shirtWearZone.x;
            shirt.y = shirtWearZone.y - 15;  // Move up by 50 pixels
            if (shirtBodyImg) {
                shirt.img = shirtBodyImg;
                shirt.scale = coef;
                shirt.width = shirtBodyImg.width * coef;
                shirt.height = shirtBodyImg.height * coef;
            }
            isShirtWorn = true;
            if (!isShirtWorn) {
                clothesDropSound.play();
            }
        } else {
            // Return to original position
            shirt.x = originalShirtX;
            shirt.y = originalShirtY;
            shirt.img = ShirtHangedImg;
            shirt.scale = coef;
            isShirtWorn = false;
        }
    }


    // Stop clothes movement sound when item is released
    if (clothesSound.isPlaying()) {
        clothesSound.stop();
    }
}


function windowResized() {
    resizeCanvas(iMacWidth * coef, iMacHeight * coef);
}


