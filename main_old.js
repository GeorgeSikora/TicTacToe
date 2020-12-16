
/* CONSTANTS */
const TILE_SIZE = window.innerHeight * 0.065;
const ROWS = 10;
const COLS = 12;

/* GLOBAL VARIABLES */
let field = [];
let myChar = 'x'; // just 'x' or 'o'

let fieldSize = {w: 0, h: 0};
let fieldCenter = {x: 0, y: 0};

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);

    for(var y = 0; y < ROWS; y++) {
        field[y] = [];
        for(var x = 0; x < COLS; x++) {
            field[y][x] = ' ';
            //field[y][x] = getRandomCell();
        }
    }

    fieldSize.w = COLS * TILE_SIZE;
    fieldSize.h = ROWS * TILE_SIZE;
    
    fieldCenter.x = width/2  - fieldSize.w/2;
    fieldCenter.y = height/2 - fieldSize.h/2;
}

function draw() {
    background(16);

    push();
    translate(width/2, (height - fieldSize.h) / 4);
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(height * 0.05);
    text(" 2:43", 0, 0);
    pop();

    push();
    translate(width/2, height - (height - fieldSize.h) / 4);
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(height * 0.04);
    text("Jsi na tahu!", 0, 0);
    pop();

    push();
    translate(fieldCenter.x, fieldCenter.y);
    for(var yy = 0; yy < ROWS; yy++) {
        for(var xx = 0; xx < COLS; xx++) {
            // pos
            var x = xx * TILE_SIZE;
            var y = yy * TILE_SIZE;

            // cell border
            noFill();
            stroke(120, 140, 100);
            strokeWeight(3);
            rect(x, y, TILE_SIZE, TILE_SIZE);

            // cell text
            fill(120, 170, 170);
            noStroke();
            textSize(64);
            textAlign(CENTER, CENTER);
            text(field[yy][xx], x + TILE_SIZE/2, y + TILE_SIZE/2);
        }
    }

    var mouse = getGrid(fieldCenter);

    if (isInsideField(mouse)) {
        var grid = {x: 0, y: 0};

        var x = mouse.x;
        var y = mouse.y;

        grid.x = ceil(x / TILE_SIZE);
        grid.y = ceil(y / TILE_SIZE);

        var cell = field[grid.y][grid.x];

        if (cell == ' ') {
            // white mouse cell
            noStroke();
            fill(255, 64);
            rect(x, y, TILE_SIZE, TILE_SIZE);

            // placing cell text
            fill(120, 255, 120);
            noStroke();
            textSize(64);
            textAlign(CENTER, CENTER);
            text(myChar, x + TILE_SIZE/2, y + TILE_SIZE/2);
        } else {
            // red mouse cell
            noStroke();
            fill(255, 0, 0, 64);
            rect(x, y, TILE_SIZE, TILE_SIZE);
        }
    }
    pop();
}

function mousePressed() {

    var mouse = getGrid(fieldCenter);
    if (isInsideField(mouse)) fieldPressed(mouse);

}

function fieldPressed(mouse) {
    // indexes of array
    var x = ceil(mouse.x / TILE_SIZE);
    var y = ceil(mouse.y / TILE_SIZE);
    
    var cell = field[y][x];
    
    if (cell == ' ') {
        field[y][x] = myChar;

        if (myChar == 'x') {
            myChar = 'o';
        } else {
            myChar = 'x';
        }
    }
}

function getGrid(center) {
    var vec = {x: 0, y: 0};
    var middle = {x: 0, y: 0};

    middle.x = mouseX;
    middle.y = mouseY;

    vec.x -= middle.x < 0 ? TILE_SIZE : 0;
    vec.y -= middle.y < 0 ? TILE_SIZE : 0;

    vec.x += (mouseX - center.x) - (middle.x - center.x) % TILE_SIZE;
    vec.y += (mouseY - center.y) - (middle.y - center.y) % TILE_SIZE;

    return vec;
}

function isInsideField(vec) {
    return (vec.x >= 0 && 
            vec.y >= 0 && 
            vec.x <  fieldSize.w && 
            vec.y <  fieldSize.h );
}

function getRandomCell() {
    switch(floor(random()*3)) {
        case 0: return ' ';
        case 1: return 'x';
        case 2: return 'o';
    }
}