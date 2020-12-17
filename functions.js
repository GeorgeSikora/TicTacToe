
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