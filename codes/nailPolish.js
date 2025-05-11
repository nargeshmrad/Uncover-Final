let topLayer;
let img1, img2; // img1 will be the top layer image, img2 the background image

function preload() {
  img1 = loadImage("assets/NailPolish/NailPolish1.png"); // Assuming Nail1.png is intended for the top layer
  img2 = loadImage("assets/NailPolish/NailPolish2.png"); // Nail2.png as the background image
}

function setup() {
  let canvas = createCanvas(1850, 1067);
  topLayer = createGraphics(windowWidth, windowHeight);
  topLayer.image(img1, 0, 0, windowHeight / 2, windowHeight);
  //erase or blend both works
  topLayer.blendMode(REMOVE);
  // topLayer.erase();
}

function draw() {
  image(img2, 0, 0, windowHeight / 2, windowHeight);
  if (mouseIsPressed) {
    topLayer.fill(255, 85);
    topLayer.noStroke();
    topLayer.ellipse(mouseX, mouseY, 100);
  }
  image(topLayer, 0, 0, windowWidth, windowHeight);
}
