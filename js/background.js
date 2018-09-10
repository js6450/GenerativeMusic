var cvs;
var barSize = 5;
var bigBarSize = barSize * 3;
var hueStart, hueRange;
var titleWidth;

function setup() {
    cvs = createCanvas(windowWidth, windowHeight);
    cvs.id('bgCanvas');
    colorMode(HSB, 360, 100, 100, 100);
    noStroke();

    hueRange = random(30, 75);
    hueStart = random(hueRange, 360 - hueRange);

    titleWidth = width * 0.15;

    background(255, 15);
    for(var i = 0; i <= height; i += barSize){
        var h = sin((frameCount + i) * 0.01) * hueRange;
        var opacity = 50;
        var xOffset = 0;

        fill(hueStart + h, 50, 80, opacity);
        rect(0 + xOffset, i, width, barSize);
    }
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);

    background(255, 15);
    for(var i = 0; i <= height; i += barSize){
        var h = sin((frameCount + i) * 0.01) * hueRange;
        var opacity = 50;
        var xOffset = 0;

        fill(hueStart + h, 50, 80, opacity);
        rect(0 + xOffset, i, width, barSize);
    }
}