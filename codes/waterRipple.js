const frmLen = 60; // Reduced from 120 to improve performance

let initPoints = [];
let points = [];
let wave = [];
let rippleGraphics;
let isCalculating = true;

function setupRipple() {
    const rippleCanvas = document.getElementById('rippleCanvas');
    if (!rippleCanvas) return; // Exit if canvas not found
    
    // Clear existing graphics if any
    if (rippleGraphics) {
        rippleGraphics.remove();
    }
    
    rippleGraphics = createGraphics(rippleCanvas.width, rippleCanvas.height);
    angleMode(DEGREES);
    initPoints = []; // Clear existing points
    points = [];
    wave = [];
    
    randomSeed(70);
    for(let i = 0; i < 36; i++){
        initPoints.push(createVector(random(rippleCanvas.width), random(rippleCanvas.height)));
    }

    // Generate wave frames
    for(let f = 0; f < frmLen; f++){
        points.push([]);
        for(let i = 0; i < initPoints.length; i++){
            let pX = 50*sin(f*360/frmLen+6*initPoints[i].x)+initPoints[i].x;
            let pY = 50*cos(f*360/frmLen+6*initPoints[i].y)+initPoints[i].y;
            points[f].push(createVector(pX, pY));
        }
    }

    for(let f = 0; f < frmLen; f++){
        wave.push([]);
        for(let x = 0; x < rippleCanvas.width; x++){
            for(let y = 0; y < rippleCanvas.height; y++){
                let distances = [];
                for(let i = 0; i < points[f].length; i++){
                    let d = (x-points[f][i].x)**2+(y-points[f][i].y)**2;
                    distances[i] = d;
                }
                let sorted = sort(distances);
                let noise = Math.sqrt(sorted[0]);
                let index = (x + y * rippleCanvas.width)*4;

                wave[f][index+0] = waveColor(noise, 40, 32, 2.2);
                wave[f][index+1] = waveColor(noise, 30, 55, 3.34);
                wave[f][index+2] = waveColor(noise, 30, 68, 3.55);
                wave[f][index+3] = 255;
            }
        }
    }
    isCalculating = false;
    pixelDensity(1);
}

function drawRipple(x, y) {
    if (isCalculating) return;
    
    let frameIndex = frameCount % frmLen;
    rippleGraphics.loadPixels();
    
    // Only draw ripples near the mouse position
    let radius = 100; // Radius around mouse to draw ripples
    let startX = Math.max(0, Math.floor(x - radius));
    let endX = Math.min(rippleCanvas.width, Math.floor(x + radius));
    let startY = Math.max(0, Math.floor(y - radius));
    let endY = Math.min(rippleCanvas.height, Math.floor(y + radius));

    for(let py = startY; py < endY; py++) {
        for(let px = startX; px < endX; px++) {
            let dist = Math.sqrt((px-x)**2 + (py-y)**2);
            if (dist <= radius) {
                let index = (px + py * rippleCanvas.width) * 4;
                rippleGraphics.pixels[index+0] = wave[frameIndex][index+0];
                rippleGraphics.pixels[index+1] = wave[frameIndex][index+1];
                rippleGraphics.pixels[index+2] = wave[frameIndex][index+2];
                rippleGraphics.pixels[index+3] = wave[frameIndex][index+3] * (1 - dist/radius); // Fade out at edges
            }
        }
    }
    
    rippleGraphics.updatePixels();
    // Draw the ripple graphics to the canvas
    let ctx = rippleCanvas.getContext('2d');
    ctx.clearRect(0, 0, rippleCanvas.width, rippleCanvas.height);
    ctx.drawImage(rippleGraphics.elt, 0, 0);
}

function waveColor(x, a, b, e){
    if(x < 0) return b;
    else return Math.pow(x/a, e)+b;
}
