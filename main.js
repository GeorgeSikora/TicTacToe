
/* CONSTANTS */
const ROWS = 10;
const COLS = 12;
const WIN_LENGTH = 5;
const VH = 0.7; // viewport height percentage 0-1 value .. 0-100%

let TILE_SIZE;

/* GLOBAL VARIABLES */
let field = [];
let myChar = 'x'; // just 'x' or 'o'

let fieldSize = {w: 0, h: 0};
let fieldCenter = {x: 0, y: 0};

let secondTimer = 0;

let time = 600;
let timeout = 15;

// end variables
let end = false;
let finalPos, finalDiagonal;

function setup() {

    setupDimensions();

    createCanvas(fieldSize.w + 10, fieldSize.h + 10);

    createField();

    refreshTimers();
    secondTimer = millis() + 1000;
}

function setupDimensions() {
    TILE_SIZE = VH * window.innerHeight/ROWS;

    fieldSize.w = COLS * TILE_SIZE;
    fieldSize.h = ROWS * TILE_SIZE;
    
    fieldCenter.x = width/2  - fieldSize.w/2;
    fieldCenter.y = height/2 - fieldSize.h/2;
}

function draw() {
    background(16);
    translate(5, 5);

    if (secondTimer < millis()) {
        secondTimer = millis() + 1000;

        time--;
        timeout--;

        if (time < 0) {
            time = 0;
            // GAME END
        }

        if (timeout < 0) {
            timeout = 15;
            // SWITCH PLAYER ROUND
        }

        refreshTimers();
    }
    
    for(var yy = 0; yy < ROWS; yy++) {
        for(var xx = 0; xx < COLS; xx++) {
            // pos
            var x = xx * TILE_SIZE;
            var y = yy * TILE_SIZE;

            // cell border
            noFill();
            stroke(120, 140, 100);
            strokeWeight(TILE_SIZE/20);
            rect(x, y, TILE_SIZE, TILE_SIZE);

            // cell text
            fill(120, 170, 170);
            noStroke();
            textSize(TILE_SIZE);
            textAlign(CENTER, CENTER);
            text(field[yy][xx], x + TILE_SIZE/2, y + TILE_SIZE/2);
        }
    }

    var mouse = getGrid();

    if (isInsideField(mouse) && !end) {
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
            textSize(TILE_SIZE);
            textAlign(CENTER, CENTER);
            text(myChar, x + TILE_SIZE/2, y + TILE_SIZE/2);
        } else {
            // red mouse cell
            noStroke();
            fill(255, 0, 0, 64);
            rect(x, y, TILE_SIZE, TILE_SIZE);
        }
    }

    if (end) {
        stroke(255, 0, 0, 100);
        strokeWeight(16);
        line(finalPos.x, finalPos.y, finalPos.x + finalDiagonal.x, finalPos.y + finalDiagonal.y);
    }
}

function mousePressed() {
    var mouse = getGrid();
    if (isInsideField(mouse)) fieldPressed(mouse);
}

function fieldPressed(mouse) {
    if (end) return;

    // indexes of array
    var x = ceil(mouse.x / TILE_SIZE);
    var y = ceil(mouse.y / TILE_SIZE);
    
    var cell = field[y][x];
    
    if (cell == ' ') {
        field[y][x] = myChar;

        if (myChar == 'x') {
            document.getElementById("message").innerHTML = "Jsi na řade!";  
            myChar = 'o';
        } else {
            document.getElementById("message").innerHTML = "Čeká se na hráčův tah...";  
            myChar = 'x';
        }

        document.getElementById("bottom").style.bottom = "-3vh";
        setTimeout(() => {
            document.getElementById("bottom").style.bottom = "0";
        }, 150);

        timeout = 15;
        refreshTimers();
        
        checkFieldsLines();
    }
}

function getGrid() {
    var vec = {x: 0, y: 0};
    var middle = {x: 0, y: 0};

    middle.x = mouseX;
    middle.y = mouseY;

    vec.x -= middle.x < 0 ? TILE_SIZE : 0;
    vec.y -= middle.y < 0 ? TILE_SIZE : 0;

    vec.x += mouseX - middle.x % TILE_SIZE;
    vec.y += mouseY - middle.y % TILE_SIZE;

    return vec;
}

function checkFieldsLines() {
    checkFieldLines('x');
    checkFieldLines('o');
}

function keyPressed() {
    /*
    end = false;
    createField();
    checkFieldsLines();
    */

}

function checkFieldLines(playerChar) {
    for(var y = 0; y < ROWS; y++) {
        for(var x = 0; x < COLS; x++) {
            if (getCell(x, y) == playerChar) {

                var diagonals = [0, 0, 0, 0];
                // Diagonal types by index
                // 0 -
                // 1 |
                // 2 / 
                // 3 \ 
                
                diagonals[0] += getDiagonal(x+1, y  ,  1,  0, playerChar, 0);
                diagonals[0] += getDiagonal(x-1, y  , -1,  0, playerChar, 0);
                var longestDiagonal = 0;
                var points = diagonals[0]; 
                
                diagonals[1] += getDiagonal(x  , y+1,  0,  1, playerChar, 0);
                diagonals[1] += getDiagonal(x  , y-1,  0, -1, playerChar, 0);
                if (diagonals[1] > points) {points = diagonals[1]; longestDiagonal = 1;}

                diagonals[2] += getDiagonal(x+1, y-1,  1, -1, playerChar, 0);
                diagonals[2] += getDiagonal(x-1, y+1, -1,  1, playerChar, 0);
                if (diagonals[2] > points) {points = diagonals[2]; longestDiagonal = 2;}
                
                diagonals[3] += getDiagonal(x-1, y-1, -1, -1, playerChar, 0);
                diagonals[3] += getDiagonal(x+1, y+1,  1,  1, playerChar, 0);
                if (diagonals[3] > points) {points = diagonals[3]; longestDiagonal = 3;}

                // involve also this single cell
                points++;
                
                /* GAME END, player win the game */
                if (points >= WIN_LENGTH) {
                    
                    var dx, dy; // diagonal dir x, y

                    switch (longestDiagonal) {
                        case 0: dx =  1; dy = 0; break;
                        case 1: dx =  0; dy = 1; break;
                        case 2: dx = -1; dy = 1; break;
                        case 3: dx =  1; dy = 1; break;
                    }

                    end = true;

                    finalPos = {
                        x: x * TILE_SIZE + TILE_SIZE / 2 * (dy | abs(dx)), 
                        y: y * TILE_SIZE + TILE_SIZE / 2 * (dy | abs(dx))
                    };

                    finalDiagonal = {
                        x: dx * (points - 1) * TILE_SIZE,
                        y: dy * (points - 1) * TILE_SIZE
                    };
                    
                    const charName = playerChar == 'o' ? 'kruhu' : 'kríže';
                    document.getElementById("message").innerHTML = 'Hráč s tvarem <span style="color: rgb(120, 170, 170)">' + charName + '</span> vyhrál!';  

                    return;
                }
            }
        }
    }
}

function getDiagonal(x, y, dx, dy, playerChar, points) {
    if (getCell(x, y) == playerChar) {
        points++;
        return getDiagonal(x + dx, y + dy, dx, dy, playerChar, points);
    } else {
        return points;
    }
}

function getCell(x, y) {
    if (x >= 0 && y >= 0 && x < COLS && y < ROWS) {
        return field[y][x];
    }
    return ' ';
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

function windowResized() {
    setupDimensions();
    resizeCanvas(fieldSize.w + 10, fieldSize.h + 10);
}

function createField() {
    for(var y = 0; y < ROWS; y++) {
        field[y] = [];
        for(var x = 0; x < COLS; x++) {
            field[y][x] = ' ';
            //field[y][x] = getRandomCell();
        }
    }
}

function refreshTimers() {

    // refresh time
    var m = floor(time / 60);
    var s = time % 60;
    document.getElementById("time").innerHTML = nf(m, 2, 0) + ":" + nf(s, 2, 0); 
    
    // refresh timeout
    document.getElementById("timeout-value").innerHTML = nf(timeout, 2, 0); 

    // blinking effect
    var timeoutElement = document.getElementById("timeout");
    if (timeout <= 4) {
        if (timeoutElement.classList.length == 0) {
            timeoutElement.classList.add("warning");
        }
    } else {
        if (timeoutElement.className == "warning") {
            timeoutElement.classList.remove("warning");
        }
    }
}