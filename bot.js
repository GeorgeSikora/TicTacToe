
function botInit() {
    botChar = reverseChar(myChar);
}

let startPos = {x: 0, y: 0};
let selectedDiagonal = 0;
// Diagonal types
// 0 -
// 1 |
// 2 / 
// 3 \ 

function refreshBot() {
    if (end) return;
    if (charOnTurn != botChar) return;

    var enemyChar = myChar;

    var botCells = getCellsCount(botChar);
    var enemyCells = getCellsCount(enemyChar);

    // Place first cell
    if (botCells == 0) {
        placeFirstCell();
        return;
    }

    // Get maximum length of player cell diagonals
    if (offensiveAttack()) return;

    // Place cells around
    var x = startPos.x;
    var y = startPos.y;
    do {
        do {
            x += round(random() * 2 -1);
            y += round(random() * 2 -1);
            if(isInsideField(x, y) == false) {
                x = startPos.x;
                y = startPos.y;
            }
        } while (isInsideField(x, y) == false);

    } while(placeCell(x, y) == false);

    // Place some random cell
    //placeRandomCell();

    checkFieldsLines();
}
// Diagonal types by index
// 0 -
// 1 |
// 2 / 
// 3 \ 

function offensiveAttack() {
    var enemyDiagonals = [];
    var enemyChar = myChar;
    for(var y = 0; y < ROWS; y++) {
        enemyDiagonals[y] = [];
        for(var x = 0; x < COLS; x++) {
            var points = 0;
            if (getCell(x, y) == enemyChar) {

                var diagonals = [0, 0, 0, 0];
                
                diagonals[0] += getDiagonal(x+1, y  ,  1,  0, enemyChar, 0);
                diagonals[0] += getDiagonal(x-1, y  , -1,  0, enemyChar, 0);
                var longestDiagonal = 0;
                points = diagonals[0]; 
                
                diagonals[1] += getDiagonal(x  , y+1,  0,  1, enemyChar, 0);
                diagonals[1] += getDiagonal(x  , y-1,  0, -1, enemyChar, 0);
                if (diagonals[1] > points) {points = diagonals[1]; longestDiagonal = 1;}

                diagonals[2] += getDiagonal(x+1, y-1,  1, -1, enemyChar, 0);
                diagonals[2] += getDiagonal(x-1, y+1, -1,  1, enemyChar, 0);
                if (diagonals[2] > points) {points = diagonals[2]; longestDiagonal = 2;}
                
                diagonals[3] += getDiagonal(x-1, y-1, -1, -1, enemyChar, 0);
                diagonals[3] += getDiagonal(x+1, y+1,  1,  1, enemyChar, 0);
                if (diagonals[3] > points) {points = diagonals[3]; longestDiagonal = 3;}

                /*
                switch (longestDiagonal) {
                    case 0: endCells[0] = getEndCell(x+1, y,  1,  0,   botChar); endCells[1] = getEndCell(x-1, y, -1,  0,   botChar); break;
                    case 1: endCells[0] = getEndCell(x, y+1,  0,  1,   botChar); endCells[1] = getEndCell(x, y-1,  0, -1,   botChar); break;
                    case 2: endCells[0] = getEndCell(x+1, y-1,  1, -1, botChar); endCells[1] = getEndCell(x-1, y+1, -1,  1, botChar); break;
                    case 3: endCells[0] = getEndCell(x-1, y-1, -1, -1, botChar); endCells[1] = getEndCell(x+1, y+1,  1,  1, botChar); break;
                }
                */

                var dx1, dy1, dx2, dy2;
                switch (longestDiagonal) {
                    case 0: dx1 =  1; dy1 =  0; dx2 = -1; dy2 =  0; break;
                    case 1: dx1 =  0; dy1 =  1; dx2 =  0; dy2 = -1; break;
                    case 2: dx1 =  1; dy1 = -1; dx2 = -1; dy2 =  1; break;
                    case 3: dx1 = -1; dy1 = -1; dx2 =  1; dy2 =  1; break;
                }

                var endCells = [];
                endCells[0] = getEndCell(x + dx1, y + dy1, dx1, dy1, botChar); 
                endCells[1] = getEndCell(x + dx2, y + dy2, dx2, dy2, botChar);

                /* WORK IN PROGRESS
                
                switch (longestDiagonal) {
                    case 0: dx[0] = 1; dy[0] = 0; dx[1] = -1; dy[1] = 0; break;
                    case 1: dx[0] = 1; dy[0] = 0; dx[1] = -1; dy[1] = 0; break;
                    case 2: dx[0] = 1; dy[0] = 0; dx[1] = -1; dy[1] = 0; break;
                    case 3: dx[0] = 1; dy[0] = 0; dx[1] = -1; dy[1] = 0; break;
                }
                */

                console.log('cell is', getCell(x + dx1, y + dy1));
                console.log('cell is', getCell(x + dx2, y + dy2));

                if (endCells[1].cell == ' ' && getCell(x + dx2, y + dy2) != 'o') {
                    console.log('cell placed !', endCells[1]);
                    return placeCell(endCells[1].x, endCells[1].y);
                }
                
                if (endCells[0].cell == ' ' && getCell(x + dx1, y + dy1) != 'o') {
                    console.log('cell placed !', endCells[0]);
                    return placeCell(endCells[0].x, endCells[0].y);
                }

                points++;
            }
            //enemyDiagonals[y][x] = {points: points, diagonal: longestDiagonal};
            enemyDiagonals[y][x] = points + ";" + longestDiagonal;
        }
    }
    console.log(enemyDiagonals);
    return false;
}

function getEndCell(x, y, dx, dy, diagonalChar) {
    if (isInsideField(x, y)) {
        if (field[y][x] != diagonalChar) {
            return {x: x, y: y, cell: field[y][x]};
        }
        x += dx;
        y += dy;
        return getEndCell(x, y, dx, dy, diagonalChar);
    }
    return -1;
}

function placeFirstCell() {
    const dist = 3;

    var x = round(COLS/2 + random() * dist - dist/2);
    var y = round(ROWS/2 + random() * dist - dist/2);

    if (placeCell(x, y) == false) {
        x += round(random() * 2 - 1);
        y += round(random() * 2 - 1);
        placeCell(x, y);
    }
    
    startPos.x = x;
    startPos.y = y;
}

function placeRandomCell() {
    do {
        var x = floor(random() * COLS);
        var y = floor(random() * ROWS);
    } while(placeCell(x, y) == false);
}