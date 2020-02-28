const jimp = require( 'jimp' );

/**
 * A fractal image creator
 *
 * Julia sets
 *
 *  for julia set we are looking at the equaion:
 *  f( z ) = z ^ 2 + c
 *  where we choose a fixed c and for all z calculate
 *  the iterates of f( z ).  We find the set that is bound.
 *  Using some theorem we can find that set by checking if
 *  f ^ n ( z ) < ( 1 + sqrt( 1 + 4 |c| ) ) / 2
 *  where f ^ n ( z ) is the nth iterate of f at z
 *
 */

class Julia {
  constructor( config ) {
    this.c = config.c;
    
    this.maxX = config.maxX;
    this.minX = config.minX;
    this.maxY = config.maxY;
    this.minY = config.minY;
    
    this.iterations = config.iterations;
    this.bound = this.boundary();
    
    this.width = config.width;
    this.height = config.height;

    this.colors = config.colors;
    this.len = config.colors.length;
    this.colormap = this.createColorMap( config.colors );
    this.background = config.background;
    
    this.fname = config.name;

    this.image;
  }

  create() {
    return this.init().then( r => this.generate() );
  }

  init() {
    return new Promise(( resolve, reject ) => {
      console.log( '    image creation')
      try {
        new jimp( this.width, this.height, this.background, ( err, i ) => {
          i.write( this.fname, ( error, img ) => {
            if ( error ) { reject( error ); }
            else {
              this.image = img;
              resolve( img );
            }
          });
        });
      }
      catch( e ) {
        reject( e );
      }
    });
  }

  generate() {
    return new Promise(( resolve, reject ) => {
      console.log( '    image generation')
      let rad;

      for( let u = 0; u < this.width; u++ ) {
        for( let v = 0; v < this.height; v++ ) {
          let z = {
            // r: this.xFromU( u, this.width, this.minX, this.maxX ),
            r: u / this.width * ( this.maxX - this.minX ) + this.minX,

            // i: this.yFromV( v, this.height, this.minY, this.maxY )
            i: this.maxY - v / this.height * ( this.maxY - this.minY )
          }
          let result = z;
          let iter = 0;
          do {
            result = this.juliafunc( result );
            // rad = this.radius( result );
            iter++;
  
            /*
            if ( rad < this.bound ) {
              this.image.setPixelColor( config.colormap( rad ), u, v );
            }
            // */
  
          }
          while( iter < this.iterations );
  
          // /*
          rad = this.radius( result );
          if ( rad < this.bound ) {
            this.image.setPixelColor( this.colormap( rad ), u, v )
          }
          // */

        }
      }
      this.image.quality( 100 );
      this.image.write( this.fname, ( error, img ) => {
        if ( error ) { reject( error ); }
        else {
          console.log( '    image written')
          this.image = img;
          resolve(  img );
        }
      });
    });
  }

  boundary() {
    let con = this.radius( this.c );
    return ( 1 + Math.sqrt( 1 + 4 * con ) ) / 2;
  }
  
  juliafunc( z ) {
    return {
      // r: Math.pow( z.r, 2 ) - Math.pow( z.i, 2 ) + this.c.r,
      r: z.r * z.r - z.i * z.i + this.c.r,
      i: 2 * z.i * z.r + this.c.i
    };
  }
  
  radius( z ) {
    // return Math.sqrt( Math.pow( z.i, 2 ) + Math.pow( z.r, 2 ) );
    return Math.sqrt( z.i * z.i + z.r * z.r );
  }
  
  xyFromUV( uv, widhei, min, max ) {
    return min + ( uv / widhei ) * ( max - min );
  }
  xFromU( u, width, min, max ) {
    return u / width * ( max - min ) + min;
  }
  
  yFromV( v, height, min, max ) {
    return max - v / height * ( max - min );
  }
  
  createColorMap( ) {
    /*
    let len = this.colors.length;
    let incr = 2 / len; // our boundary is 2 so only looking at values less than 2
    let cmapkeys = [];
    let cmap = {};
    for( let i = 0; i < len; i++ ) {
      let key = ( i * incr ).toString();
      cmap[ key ] = this.colors[ i ];
      cmapkeys.push( key );
    }
    console.log( `color map has ${len} colors` );
    return ( rad ) => {
      for ( let i = 0; i < len; i++ ) {
        if( rad < parseFloat( cmapkeys[i] ) ) {
          return cmap[ cmapkeys[i] ];
        }
      }
      return cmap[ cmapkeys[len - 1 ]];
    };
    */
    let len = this.colors.length;
    let incr = 2 / len; // our boundary is 2 so only looking at values less than 2
    return  rad => {
      return this.colors[ Math.floor( rad / incr ) ];
    };
  }

}

module.exports.Julia = Julia;


class Mandelbrot {
  constructor( config ) {
    this.maxX = config.maxX;
    this.minX = config.minX;
    this.maxY = config.maxY;
    this.minY = config.minY;
    
    this.iterations = config.iterations;
    
    this.width = config.width;
    this.height = config.height;

    this.colors = config.colors;
    this.len = config.colors.length;
    this.colormap = this.createColorMap( config.colors );
    this.background = config.background;
    
    this.fname = config.name;

    this.image;
  }

  create() {
    return this.init().then( r => this.generate() );
  }

  init() {
    return new Promise(( resolve, reject ) => {
      console.log( '    image creation')
      try {
        new jimp( this.width, this.height, this.background, ( err, i ) => {
          i.write( this.fname, ( error, img ) => {
            if ( error ) { reject( error ); }
            else {
              this.image = img;
              resolve( img );
            }
          });
        });
      }
      catch( e ) {
        reject( e );
      }
    });
  }

  generate() {
    return new Promise(( resolve, reject ) => {
      console.log( '    image generation')
      let rad;

      for( let u = 0; u < this.width; u++ ) {
        for( let v = 0; v < this.height; v++ ) {
          let z = {
            r: this.xFromU( u, this.width, this.minX, this.maxX ),
            i: this.yFromV( v, this.height, this.minY, this.maxY )
          }
          let result = z;
          let iter = 0;
          do {
            result = this.mandelfunc( result, z );
            rad = this.radius( result );
            iter++;
            
            /*
            if ( rad < 2 ) {
              this.image.setPixelColor( this.colormap( rad ), u, v );
            }
            // */
  
          }
          while( iter < this.iterations );
  
          // /*
          rad = this.radius( result );
          if ( rad < 2 ) {
            this.image.setPixelColor( this.colormap( rad ), u, v );
          }
          // */
          

        }
      }
      this.image.quality( 100 );
      this.image.write( this.fname, ( error, img ) => {
        if ( error ) { reject( error ); }
        else {
          console.log( '    image written')
          this.image = img;
          resolve(  img );
        }
      });
    });
  }

  mandelfunc( c, z ) {
    return {
      r: c.r * c.r - c.i * c.i + z.r,
      i: 2 * c.i * c.r + z.i
    };
  }
  
  radius( z ) {
    return Math.sqrt( z.i * z.i + z.r * z.r );
  }
  
  xyFromUV( uv, widhei, min, max ) {
    return min + ( uv / widhei ) * ( max - min );
  }
  
  xFromU( u, width, min, max ) {
    return u / width * ( max - min ) + min;
  }
  
  yFromV( v, height, min, max ) {
    return max - v / height * ( max - min );
  }
  
  createColorMap( ) {
    /*
    let len = this.colors.length;
    let incr = 2 / len; // our boundary is 2 so only looking at values less than 2
    let cmapkeys = [];
    let cmap = {};
    for( let i = 0; i < len; i++ ) {
      let key = ( i * incr ).toString();
      cmap[ key ] = this.colors[ i ];
      cmapkeys.push( key );
    }
    console.log( `color map has ${len} colors` );
    return ( rad ) => {
      for ( let i = 0; i < len; i++ ) {
        // console.log( rad );
        if( rad < parseFloat( cmapkeys[i] ) ) {
          return cmap[ cmapkeys[i] ];
        }
      }
      return cmap[ cmapkeys[len - 1 ]];
    };
    */
    let len = this.colors.length;
    let incr = 2 / len; // our boundary is 2 so only looking at values less than 2
    return  rad => {
      return this.colors[ Math.floor( rad / incr ) ];
    };
  }

}

module.exports.Mandelbrot = Mandelbrot;
