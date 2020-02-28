const tg = require( 'tinygradient' );

 /**
  * Generate a color gradient with over the color range provided {colorrange} with
  * {steps} number of steps
  * @param { {r:number, g:number, b: number}[] } colorrange 
  * @param { number } steps 
  * @returns { number[] } integer array of colors
  */
function generateColors( colorrange, steps ) {
  const range = tg( colorrange );
  const colrgb = range.rgb( steps );
  const colint = colrgb.map( color => {
    return parseInt( color.toHex8(), 16 );
  });
  return colint;
}

/**
 * Return a config object with sensible default values used to create either
 * Julia or Mandelbrot fractal
 * @param {string} fname 
 * @param {number} zconstant 
 * @param {number[]} colors 
 * @param {{ maxx:number, maxy:number, minx:number, miny:number}} box 
 * @param {{ w:number, h:number}} resolution 
 * @param {number} iteratons 
 */
function createConfigs( fname, zconstant, colors, box, resolution, iteratons ) {
  box = box || {};
  resolution = resolution || {};
  zconstant = zconstant || {  "r": -0.4, "i": 0.59 };
  colors = colors || generateColors( [{r:64,g:224,b:208},{r:255,g:140,b:0},{r:255,g:0,b:128},{r:0,g:0,b:0}], 50 );
  return {
    c: zconstant,
    maxX: typeof box.maxx === 'number' ? box.maxx : 2,
    minX: typeof box.minx === 'number' ? box.minx : -2,
    maxY: typeof box.maxy === 'number' ? box.maxy : 1,
    minY: typeof box.miny === 'number' ? box.miny : -1,
    iterations: iteratons || 100,
    colors: colors,
    width: resolution.w || 1920,
    height: resolution.h || 1080,
    background: 0x00000000,
    name: fname || `./pics/${Date.now()}.jpg`
  };
}

module.exports = {
  generateColors,
  createConfigs
};