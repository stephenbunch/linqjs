/*!
 * linqjs v0.1.0
 * (c) 2013 Stephen Bunch https://github.com/stephenbunch/linqjs
 * License: MIT
 */
( function ( window, undefined ) {

"use strict";

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
        return items;
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
        signature = trim( parts[0] );
        body = parts[1];

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

linq.extend(
{
    /**
     * @description Maps each item to a new item.
     * @param {lambda} selector
     * @returns {Enumerable}
     */
    select: function( selector )
    {
        selector = linq.lambda( selector );
        if ( !selector )
            throw new Error( "A selector is required." );
        var self = this;
        return linq.enumerable( function()
        {
            var current = null, e = self.enumerator();
            this.current = function() {
                return current;
            };
            this.next = function()
            {
                var ret;
                current = ( ret = e.next() ) ? selector.call( self, e.current() ) : null;
                return ret;
            };
        });
    },

    /**
     * @description Excludes items that don't match the filter.
     * @param {lambda} filter
     * @returns {Enumerable}
     */
    where: function( filter )
    {
        filter = linq.lambda( filter );
        var self = this;
        return linq.enumerable( function()
        {
            var current = null, e = self.enumerator();
            this.current = function() {
                return current;
            };
            this.next = function()
            {
                while ( e.next() )
                {
                    if ( filter.call( self, e.current() ) )
                    {
                        current = e.current();
                        return true;
                    }
                }
                return false;
            };
        });
    },

    /**
     * @description Gets the first 'x' number of items.
     * @param {number} number
     * @returns {Enumerable}
     */
    take: function( number )
    {
        var self = this;
        return linq.enumerable( function()
        {
            var e = self.enumerator(), count = 0;
            this.current = function() {
                return e.current();
            };
            this.next = function() {
                return count++ < number && e.next();
            };
        });
    },

    /**
     * @description Excludes the first 'x' number of items.
     * @param {number} number
     * @returns {Enumerable}
     */
    skip: function( number )
    {
        var self = this;
        return linq.enumerable( function()
        {
            var e = self.enumerator(), count = 0;
            this.current = function() {
                return e.current();
            };
            this.next = function()
            {
                while ( count < number && e.next() )
                    count++;
                return e.next();
            };
        });
    },

    /**
     * @description
     * Skips every other 'x' item. A number of 1 includes every item. A number of 2 skips
     * every other item.
     * @param {number} number
     * @returns {Enumerable}
     */
    step: function( number )
    {
        var self = this;
        return linq.enumerable( function()
        {
            var e = self.enumerator(), started = false;
            this.current = function() {
                return e.current();
            };
            this.next = function()
            {
                if ( !started )
                {
                    started = true;
                    return e.next();
                }
                var i = 1;
                while ( i < number && e.next() )
                    i++;
                return e.next();
            };
        });
    },

    groupBy: function( keySelector )
    {
        var self = this;
        keySelector = linq.lambda( keySelector );
        if ( !keySelector )
            throw new Error( "A key selector is required." );
        return linq.enumerable( function()
        {
            var e = self.enumerator(),
                keys = [],
                groups = {};

            while ( e.next() )
            {
                var current = e.current();
                var key = keySelector( current );
                if ( !groups[ key ] )
                {
                    groups[ key ] =
                    {
                        key: key,
                        items: []
                    };
                    keys.push( key );
                }
                groups[ key ].items.push( current );
            }

            var i = -1,
                len = keys.length;

            this.current = function() {
                return i < 0 || i >= len ? null : groups[ keys[ i ] ];
            };
            this.next = function() {
                return ++i < len;
            };
        });
    },

    union: function( items )
    {
        var self = this;
        items = linq.from( items );
        return linq.enumerable( function()
        {
            var e1 = self.enumerator();
            var e2 = items.enumerator();
            var first = true;
            this.current = function() {
                return first ? e1.current() : e2.current();
            };
            this.next = function() {
                return e1.next() || ( first = false ) || e2.next();
            };
        });
    },

    orderBy: function( selector )
    {
        var self = this;
        selector = linq.lambda( selector );
        if ( !selector )
            throw new Error( "A selector is required." );
        var comparer = function( x, y )
        {
            var a = selector( x ),
                b = selector( y );
            return a > b ? 1 : a < b ? -1 : 0;
        };
        var ret = linq.enumerable( function() {
            return from( self.array().sort( comparer ) ).enumerator();
        });
        ret.thenBy = function( selector )
        {
            if ( !selector )
                throw new Error( "A selector is required." );
            selector = linq.lambda( selector );
            var _super = comparer;
            comparer = function( x, y )
            {
                var result = _super( x, y );
                if ( result === 0 )
                {
                    var a = selector( x ),
                        b = selector( y );
                    result = a > b ? 1 : a < b ? -1 : 0;
                }
                return result;
            };
            return ret;
        };
        ret.descending = function()
        {
            var _super = comparer;
            comparer = function( x, y ) {
                return -1 * _super( x, y );
            };
            return ret;
        };
        return ret;
    }
});

linq.extend(
{
    /**
     * @description Executes a callback for each item in the enumeration.
     * @param {function} callback
     */
    each: function( callback )
    {
        var e = this.enumerator(), i = 0;
        while ( e.next() )
        {
            if ( callback.call( this, e.current(), i++ ) === false )
                break;
        }
    },

    /**
     * @description Converts the enumerable into an array.
     * @returns {array}
     */
    array: function()
    {
        var ret = [], e = this.enumerator();
        while ( e.next() )
            ret.push( e.current() );
        return ret;
    },

    /**
     * @description Gets the first item in the enumeration.
     * @returns {mixed}
     */
    first: function()
    {
        var e = this.enumerator();
        e.next();
        return e.current();
    },

    /**
     * @description Gets the last item in the enumeration.
     * @returns {mixed}
     */
    last: function()
    {
        var e = this.enumerator();
        var ret = null;
        while ( e.next() )
            ret = e.current();
        return ret;
    },

    /**
     * @description Gets the number of items in the enumerable.
     * @returns {number}
     */
    count: function()
    {
        var e = this.enumerator(), count = 0;
        while ( e.next() )
            count++;
        return count;
    },

    /**
     * @description Converts the enumerable into an object.
     * @param {lambda} [keySelector]
     * @param {lambda} [valueSelector]
     * @returns {object}
     */
    hash: function( keySelector, valueSelector )
    {
        var self = this,
            ret = {},
            e = this.enumerator(),
            selectKey = arguments.length > 0 && !!keySelector,
            selectValue = arguments.length > 1,
            i = 0,
            key, value, current;

        keySelector = linq.lambda( keySelector );
        valueSelector = linq.lambda( valueSelector );

        while ( e.next() )
        {
            current = e.current();
            key =
                selectKey ? keySelector.call( self, current ) :
                current.key !== undefined ? current.key :
                i;
            value =
                selectValue ? valueSelector.call( self, current ) :
                current.value !== undefined ? current.value :
                current;
            ret[ key ] = value;
            i++;
        }
        return ret;
    },

    /**
     * @description Gets whether the enumerable contains an item.
     * @param {mixed} item
     * @returns {boolean}
     */
    contains: function( item )
    {
        var e = this.enumerator();
        while ( e.next() )
        {
            if ( e.current() === item )
                return true;
        }
        return false;
    },

    /**
     * @description Gets whether the enumerable contains any items.
     * @returns {boolean}
     */
    any: function()
    {
        return this.first() !== null;
    }
});

} ( window ) );
