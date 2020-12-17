
function mousePressed() {
    var mouse = getGrid();
    
    if (isVectorInsideField(mouse)) 
        fieldPressed(mouse);
}

function keyPressed() {
    /*
    end = false;
    createField();
    checkFieldsLines();
    */
}