var linq = window.linq = {};

var Enumerable = linq.enumerable = function( Enumerator )
{
    if ( !( this instanceof Enumerable ) )
        return new Enumerable( Enumerator );
    this.enumerator = function() {
        return new Enumerator();
    };
};

linq.fn = Enumerable.prototype;

/**
 * @description Extends the Enumerable prototype with new methods.
 * @param {object} methods
 */
linq.extend = function( methods )
{
    var name;
    for ( name in methods )
    {
        if ( methods.hasOwnProperty( name ) )
            linq.fn[ name ] = methods[ name ];
    }
};

/**
 * @description Converts an array into an enumerable.
 * @param {array|object|Enumerable} items
 * @returns {Enumerable}
 */
linq.from = window.from = function( items )
{
    items = items || [];
    if ( typeOf( items.enumerator ) === "function" )
        return new Enumerable( items.enumerator );
    if ( !isArrayLike( items ) )
    {
        var obj = items, prop;
        items = [];
        for ( prop in obj )
        {
            if ( obj.hasOwnProperty( prop ) )
                items.push({ key: prop, value: obj[ prop ] });
        }
    }
    return new Enumerable( function()
    {
        var index = -1, length = items.length;
        this.current = function() {
            return index < 0 || index >= length ? null : items[ index ];
        };
        this.next = function() {
            return ++index < length;
        };
    });
};

/**
 * @description Creates a new enumerable with an item for each index.
 * @param {number} times The length of the enumeration.
 * @returns {Enumerable}
 */
linq.times = window.times = function( times )
{
    var i = 0, items = [];
    for ( ; i < times; i++ )
        items.push( i );
    return linq.from( items );
};

/**
 * @description Creates a new enumerable with an item for each index in the range.
 * @param {number|array} start The first index, or a 2-element array with the start and end index.
 * @param {number} [end] The last index.
 */
linq.range = window.range = function( start, end )
{
    if ( typeOf( start ) === "array" )
    {
        end = start[1];
        start = start[0];
    }
    var items = [];
    for ( ; start <= end; start++ )
        items.push( start );
    return linq.from( items );
};

// Tests whether a function signature is valid. Also creates a back reference
// of just the parameter list (no parentheses).
var sig_csharp = /^\(? *([a-zA-Z_$]+[a-zA-Z_$0-9]* *(?:, *[a-zA-Z_$]+[a-zA-Z_$0-9]* *)*)?\)?$/;
var sig_ruby = /^\| *([a-zA-Z_$]+[a-zA-Z_$0-9]* *(?:, *[a-zA-Z_$]+[a-zA-Z_$0-9]* *)*)\|/;

/**
 * @description
 * Compiles the specified lambda expression into a function. Lambda body should be
 * a single statement that can be returned.
 *
 * @example
 *   linq.lambda( "() => 42" )              -> function() { return 42; }
 *   linq.lambda( "(x) => x" )              -> function( x ) { return x; }
 *   linq.lambda( "x => x.foo" )            -> function( x ) { return x.foo; }
 *   linq.lambda( "a, b, c => a ? b : c" )  -> function( a, b, c ) { return a ? b : c; }
 *   linq.lambda( "|x| x.foo" )             -> function( x ) { return x.foo; }
 *
 * @param {string} expression
 * @returns {function}
 */
linq.lambda = function( expression )
{
    // As a convenience, allow passing actual functions.
    if ( typeOf( expression ) !== "string" ) return expression;

    expression = trim( expression );
    var signature, body;

    // Check for ruby lambda syntax.
    if ( sig_ruby.test( expression ) )
    {
        signature = expression.match( sig_ruby )[1];
        body = expression.substr( expression.indexOf( "|", 1 ) + 1 );
    }
    else
    {
        if ( expression.indexOf( "=>" ) === -1 )
            throw new SyntaxError( "Not a valid lambda expression. Example: x => x.foo" );

        var parts = expression.split( "=>" );
        signature = trim( parts.shift() );
        body = parts.join( "=>" );

        if ( signature === "" )
            throw new SyntaxError( "Lambda signature missing. For a parameterless signature, use: () => 42" );

        // Validate signature. Also remove any wrapping parentheses.
        if ( sig_csharp.test( signature ) )
            signature = signature.match( sig_csharp )[1];
        else
            throw new SyntaxError( "Lambda signature is invalid." );
    }

    body = trim( body || "" );
    if ( body === "" )
        throw new SyntaxError( "Lambda must return something." );

    // Return compiled function.
    /*jslint evil: true */
    return new Function( signature, "return " + body );
};

/**
 * @private
 * @description
 * Determines whether an object can be iterated over like an array.
 * Based on jQuery's each function.
 * @param {object} obj
 * @returns {boolean}
 */
function isArrayLike( obj )
{
    var length = obj.length,
        type = typeOf( obj );

    if ( type === "window" )
        return false;

    if ( obj.nodeType === 1 && length )
        return true;

    return type === "array" ||
        type !== "function" &&
        (
            length === 0 ||
            typeof length === "number" && length > 0 && ( length - 1 ) in obj
        );
}

/**
 * @private
 * @description
 * Gets the internal JavaScript [[Class]] of an object.
 * http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
 * @param {object} object
 * @returns {string}
 */
function typeOf( object )
{
    return Object.prototype.toString.call( object )
        .match( /^\[object\s(.*)\]$/ )[1].toLowerCase();
}

/**
 * @private
 * @description
 * Removes trailing whitespace from a string.
 * http://stackoverflow.com/a/2308157/740996
 * @param {string} value
 * @returns {string}
 */
function trim( value ) {
    return value.trim ? value.trim() : value.replace( /^\s+|\s+$/g, "" );
}
