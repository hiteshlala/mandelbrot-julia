const { createConfigs, Julia, Mandelbrot } = require( './index' );

const configs = createConfigs( './pics/julia.jpg' );

const julia = new Julia( configs );

let time = Date.now();
julia.create()
.then( (a) => {
  const elapsed = ( Date.now() - time ) / 1000;
  console.log( 'Julia Done:', elapsed, 'seconds' );

  configs.name = './pics/mandel.jpg';
  const mandel = new Mandelbrot( configs );
  
  time = Date.now();
  return mandel.create();
})
.then( (a) => {
  const elapsed = ( Date.now() - time ) / 1000;
  console.log( 'Mandel Done:', elapsed, 'seconds' );
})
.catch( e => console.log(e) );

