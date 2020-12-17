
/* CONSTANTS */
let ROWS = 9; // 9
let COLS = 12; // 12
const WIN_LENGTH = 5;
const VH = 0.7; // viewport height percentage 0-1 value .. 0-100%

let TILE_SIZE;

/* GLOBAL VARIABLES */
let field = [];

let myChar = 'x'; // just 'x' or 'o'
let botChar;
let charOnTurn = myChar; // wich char is on turn

let fieldSize = {w: 0, h: 0};
let fieldCenter = {x: 0, y: 0};

let secondTimer = 0;

let time = 600;
let timeout = 15;

// end variables
let end = false;
let diagonalStart, diagonalEnd;

function setup() {
    
    setupDimensions();

    createCanvas(fieldSize.w + 10, fieldSize.h + 10);

    createField();

    updateTimer();
    secondTimer = millis() + 1000;

    botInit();
}

function draw() {
    background(16);
    translate(5, 5);

    refreshTimer();
    refreshBot();
    
    drawField();

    if (!end && myChar == charOnTurn) 
        drawSelectedCell();

    if (end)
        drawDiagonal();
}

function setupDimensions() {

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {

        var COLS_ = COLS;
        var ROWS_ = ROWS;

        if (COLS > ROWS) {
            COLS = ROWS_;
            ROWS = COLS_;
        }

        TILE_SIZE = 0.925 * window.innerWidth/COLS; // For mobiles & tablets
    } else {
        TILE_SIZE = VH * window.innerHeight/ROWS; // For computers/notebooks
    }

    fieldSize.w = COLS * TILE_SIZE;
    fieldSize.h = ROWS * TILE_SIZE;
    
    fieldCenter.x = width/2  - fieldSize.w/2;
    fieldCenter.y = height/2 - fieldSize.h/2;
}

function windowResized() {
    setupDimensions();
    resizeCanvas(fieldSize.w + 10, fieldSize.h + 10);
}