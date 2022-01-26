canvasCorners = apply(screenbounds(), #.xy); //LO, RO, RU, LU
canvasCorners = {
    "tl": canvasCorners_1,
    "tr": canvasCorners_2,
    "br": canvasCorners_3,
    "bl": canvasCorners_4
};
canvasCenter  = 0.5 * canvasCorners.tl + 0.5 * canvasCorners.br;
canvasWidth   = dist(canvasCorners.tl, canvasCorners.tr);
canvasHeight  = dist(canvasCorners.tl, canvasCorners.bl);
[canvasLeft, canvasTop] = canvasCorners.tl;
[canvasRight, canvasBottom] = canvasCorners.br;
screenMouse() := [(mouse().x - canvasLeft) / canvasWidth, (mouse().y - canvasBottom) / canvasHeight];


egdodLoaded = true;