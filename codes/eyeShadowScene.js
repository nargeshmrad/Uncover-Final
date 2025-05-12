let brushImg;
let brushOpacity = 255;
let brushActive = false;
let activeColor = null; // 'pink', 'yellow', or 'green'

// Define eyeshadow area dimensions
let eyeshadowArea = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
};

function preload() {
    brushImg = loadImage('../assets/EyeShadowScene/brush.png');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    // Hide the default cursor
    noCursor();
    
    // Make sure hotspots don't show cursor
    document.querySelectorAll('.hotspot').forEach(hotspot => {
        hotspot.style.cursor = 'none';
    });
    
    // Initially hide all eyeshadows
    ['pink', 'yellow', 'green'].forEach(color => {
        const eyeshadow = document.getElementById(color + 'Eyeshadow');
        eyeshadow.style.display = 'none';
        eyeshadow.style.opacity = '0';
    });
    
    // Start playing background music
    audio.loop = true; // Make the music loop
    audio.volume = 0.5; // Set volume to 50%
    audio.play();
}

function updateEyeshadowArea() {
    eyeshadowArea.x = width * 0.36; // 36% from left
    eyeshadowArea.y = height * 0.23; // 23% from top
    eyeshadowArea.width = width * 0.25; // 25% of window width
    eyeshadowArea.height = eyeshadowArea.width; // Make it square
}

function draw() {
    // Clear the previous frame
    clear();
    
    // Draw cursor
    if (brushImg) {
        push();
        imageMode(CENTER);
        
        // Get current hotspot
        const isOverGreen = isOverHotspot(hotspotGreen);
        const isOverRed = isOverHotspot(hotspotRed);
        const isOverWhite = isOverHotspot(hotspotWhite);
        
        // Set brush color based on active state and position
        if (brushActive) {
            switch(activeColor) {
                case 'pink':
                    tint(255, 150, 150, brushOpacity); // Red tint
                    break;
                case 'yellow':
                    tint(255, 255, 150, brushOpacity); // Yellow tint
                    break;
                case 'green':
                    tint(150, 255, 150, brushOpacity); // Green tint
                    break;
            }
        } else if (isOverGreen || isOverRed || isOverWhite) {
            tint(220, 220, 220, brushOpacity);
        } else {
            tint(255, 255, 255, brushOpacity);
        }
        
        image(brushImg, mouseX, mouseY, 100, 100);
        noTint();
        pop();
    }
}

function isOverHotspot(hotspot) {
    const rect = hotspot.getBoundingClientRect();
    return mouseX >= rect.left && mouseX <= rect.right && 
           mouseY >= rect.top && mouseY <= rect.bottom;
}

// Handle window resizing
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    updateEyeshadowArea();
    
    // Recreate mask canvas at new size
    maskCanvas = createGraphics(windowWidth, windowHeight);
    maskCanvas.background(0);
}

// Original eyeShadowScene interaction code
const hotspotGreen = document.getElementById('hotspotGreen');
const eyeshadow = document.getElementById('eyeshadow');
const audio = document.getElementById('eyeShadowAudio');



function revealEyeshadow(color) {
    if (brushActive && activeColor === color) return; // Already showing this color
    
    // Hide any currently showing eyeshadow
    if (activeColor) {
        const currentEyeshadow = document.getElementById(activeColor + 'Eyeshadow');
        currentEyeshadow.style.opacity = '0';
        setTimeout(() => {
            currentEyeshadow.style.display = 'none';
        }, 2000); // Match transition duration
    }
    
    brushActive = true;
    activeColor = color;
    
    // Visual feedback - make brush glow brighter briefly
    brushOpacity = 355;
    setTimeout(() => {
        brushOpacity = 255;
    }, 200);
    
    // Show and fade in the new eyeshadow
    const eyeshadow = document.getElementById(color + 'Eyeshadow');
    eyeshadow.style.opacity = '0';
    eyeshadow.style.display = 'block';
    
    // Force a reflow to ensure the display change is processed
    eyeshadow.offsetHeight;
    
    // Start the fade
    requestAnimationFrame(() => {
        eyeshadow.style.opacity = '1';
    });
    
    // No sound on click
}

// Click handlers for each hotspot
hotspotGreen.addEventListener('click', () => revealEyeshadow('pink'));
hotspotRed.addEventListener('click', () => revealEyeshadow('yellow'));
hotspotWhite.addEventListener('click', () => revealEyeshadow('green'));

// Hover handlers for hotspots
[hotspotGreen, hotspotRed, hotspotWhite].forEach(hotspot => {
    hotspot.addEventListener('mouseenter', () => {
        if (!brushActive) {
            document.body.style.cursor = 'pointer';
        }
    });
    
    hotspot.addEventListener('mouseleave', () => {
        document.body.style.cursor = 'default';
    });
});


