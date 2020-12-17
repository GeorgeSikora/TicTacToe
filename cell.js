
function reverseChar(c) {
    return c == 'o' ? 'x' : 'o';
}

function getRandomCell() {
    switch (floor(random() * 3)) {
        case 0: return ' ';
        case 1: return 'x';
        case 2: return 'o';
    }
}

function getCell(x, y) {
    if (isInsideField(x, y)) {
        return field[y][x];
    }
    return ' ';
}

function getCellsCount(c) {
    var count = 0;
    for (var y = 0; y < ROWS; y++) 
        for (var x = 0; x < COLS; x++) 
            if (field[y][x] == c) count ++;
    return count;
}

function placeCell(x, y) {
    var cell = field[y][x];
    
    if (cell == ' ') {
        field[y][x] = charOnTurn;
        charOnTurn = reverseChar(charOnTurn);
        return true;
    }

    return false;
}

function drawSelectedCell() {

    var mouse = getGrid();

    if (isVectorInsideField(mouse)) {
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
}