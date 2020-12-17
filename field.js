
function drawField() {
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
}

function drawDiagonal() {
    stroke(255, 0, 0, 100);
    strokeWeight(16);
    line(diagonalStart.x * TILE_SIZE + TILE_SIZE/2, diagonalStart.y * TILE_SIZE + TILE_SIZE/2, diagonalEnd.x * TILE_SIZE + TILE_SIZE/2, diagonalEnd.y * TILE_SIZE + TILE_SIZE/2);
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

function isInsideField(x, y) {
    return (x >= 0 && y >= 0 && x < COLS && y < ROWS);
}

function isVectorInsideField(vec) {
    return (vec.x >= 0 && 
            vec.y >= 0 && 
            vec.x <  fieldSize.w && 
            vec.y <  fieldSize.h );
}

function fieldPressed(mouse) {
    if (end) return;
    if (myChar != charOnTurn) return;

    // indexes of array
    var x = ceil(mouse.x / TILE_SIZE);
    var y = ceil(mouse.y / TILE_SIZE);
    
    if (myChar == charOnTurn) {
        document.getElementById("message").innerHTML = "Jsi na řade!";  
    } else {
        document.getElementById("message").innerHTML = "Čeká se na hráčův tah..."; 
    }
    
    // try to place cell, if it is already placed, return
    if (placeCell(x, y) == false) return;

    document.getElementById("bottom").style.bottom = "-3vh";
    setTimeout(() => {
        document.getElementById("bottom").style.bottom = "0";
    }, 150);

    timeout = 15;
    updateTimer();
    
    checkFieldsLines();
}

function checkFieldsLines() {
    checkFieldLines('x');
    checkFieldLines('o');
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

                    diagonalStart = {x: x, y: y};
                    diagonalEnd = {x: x + dx * (points-1), y: y + dy * (points-1)};
                    
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
    }
    return points;
}