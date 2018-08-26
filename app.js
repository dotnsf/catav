// app.js

var cfenv = require( 'cfenv' );
var express = require( 'express' );
var bodyParser = require( 'body-parser' );
var app = express();

var appEnv = cfenv.getAppEnv();

app.use( bodyParser.urlencoded() );
app.use( bodyParser.json() );


app.get( '/', function( req, res ){
  res.render( 'index', {} );
});

//. Categorized Average
app.post( '/catavg', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );
  console.log( 'POST /catavg' );

  //. req.body.values = [ 1.0, 2.0, 3.0, .., 10.0 ];
  //. req.body.categories = [ 'A', 'A', 'B', .., 'C' ];
  var values = ( req.body.values && req.body.values.length ) ? req.body.values : null;
  var categories = ( req.body.categories && req.body.categories.length ) ? req.body.categories : null;

  if( values && categories && values.length == categories.length ){
    //. distinct categories
    var dc = distinctCategories( categories );
    var cats = dc.cats;
    var index = dc.index;

    //. categorized sum
    var cs = categorizedSum( categories, values, cats, index );
    var avgs = cs.vals;
    var cnts = cs.cnts;

    for( var i = 0; i < avgs.length; i ++ ){
      avgs[i] /= cnts[i];
    }

    res.write( JSON.stringify( { status: true, categories: cats, catavgs: avgs, counts: cnts }, 2, null ) );
    res.end();
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false, message: 'values and categories need to be posted as array with same length.' }, 2, null ) );
    res.end();
  }
});

//. Categorized Variance
app.post( '/catvar', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );
  console.log( 'POST /catvar' );

  //. req.body.values = [ 1.0, 2.0, 3.0, .., 10.0 ];
  //. req.body.categories = [ 'A', 'A', 'B', .., 'C' ];
  var values = ( req.body.values && req.body.values.length ) ? req.body.values : null;
  var categories = ( req.body.categories && req.body.categories.length ) ? req.body.categories : null;

  if( values && categories && values.length == categories.length ){
    //. distinct categories
    var dc = distinctCategories( categories );
    var cats = dc.cats;
    var index = dc.index;

    //. categorized sum
    var cs = categorizedSum( categories, values, cats, index );
    var avgs = cs.vals;
    var cnts = cs.cnts;
    for( var i = 0; i < avgs.length; i ++ ){
      avgs[i] /= cnts[i];
    }

    //. categorized sum distance
    var cds = categorizedSumDistance( categories, values, cats, index, avgs );
    var vars = cs.vals;
    for( var i = 0; i < vars.length; i ++ ){
      vars[i] /= cnts[i];
    }

    res.write( JSON.stringify( { status: true, categories: cats, catvars: vars, counts: cnts }, 2, null ) );
    res.end();
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false, message: 'values and categories need to be posted as array with same length.' }, 2, null ) );
    res.end();
  }
});

//. Categorized Stdev
app.post( '/catstd', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );
  console.log( 'POST /catstd' );

  //. req.body.values = [ 1.0, 2.0, 3.0, .., 10.0 ];
  //. req.body.categories = [ 'A', 'A', 'B', .., 'C' ];
  var values = ( req.body.values && req.body.values.length ) ? req.body.values : null;
  var categories = ( req.body.categories && req.body.categories.length ) ? req.body.categories : null;

  if( values && categories && values.length == categories.length ){
    //. distinct categories
    var dc = distinctCategories( categories );
    var cats = dc.cats;
    var index = dc.index;

    //. categorized sum
    var cs = categorizedSum( categories, values, cats, index );
    var avgs = cs.vals;
    var cnts = cs.cnts;
    for( var i = 0; i < avgs.length; i ++ ){
      avgs[i] /= cnts[i];
    }

    //. categorized sum distance
    var cds = categorizedSumDistance( categories, values, cats, index, avgs );
    var stds = cs.vals;
    for( var i = 0; i < stds.length; i ++ ){
      stds[i] /= cnts[i];
      stds[i] = Math.pow( stds[i], 0.5 );
    }

    res.write( JSON.stringify( { status: true, categories: cats, catstds: stds, counts: cnts }, 2, null ) );
    res.end();
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false, message: 'values and categories need to be posted as array with same length.' }, 2, null ) );
    res.end();
  }
});


function distinctCategories( categories ){
  var cats = [];
  var index = {};
  categories.forEach( function( category ){
    if( cats.indexOf( category ) == -1 ){
      index[category] = cats.length;
      cats.push( category );
    }
  });

  return { cats: cats, index: index };
}

function categorizedSum( categories, values, cats, index ){
  var vals = new Array(cats.length);
  var cnts = new Array(cats.length);
  for( var i = 0; i < vals.length; i ++ ){
    vals[i] = 0.0;
    cnts[i] = 0;
  }
  for( var i = 0; i < values.length; i ++ ){
    vals[index[categories[i]]] += values[i];
    cnts[index[categories[i]]] ++;
  }

  return { vals: vals, cnts: cnts };
}

function categorizedSumDistance( categories, values, cats, index, avgs ){
  var vals = new Array(cats.length);
  var cnts = new Array(cats.length);
  for( var i = 0; i < vals.length; i ++ ){
    vals[i] = 0.0;
    cnts[i] = 0;
  }
  for( var i = 0; i < values.length; i ++ ){
    vals[index[categories[i]]] += Math.pow( avgs[index[categories[i]]] - values[i], 2 );
    cnts[index[categories[i]]] ++;
  }

  return { vals: vals, cnts: cnts };
}



var port = appEnv.port || 3000;
app.listen( port );
console.log( 'server started on ' + port );
