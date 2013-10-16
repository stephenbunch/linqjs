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
linq.extend = function( methods )
{
    var name;
    for ( name in methods )
    {
        if ( methods.hasOwnProperty( name ) )
            linq.fn[ name ] = methods[ name ];
    }
};

var from = window.from = linq.from = function( items )
{
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

linq.extend(
{
    select: function( selector )
    {
        var self = this, e = self.enumerator();
        return linq.enumerable( function()
        {
            var current = null;
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
    }
});

linq.extend(
{
    each: function( callback )
    {
        var e = this.enumerator(), i = 0;
        while ( e.next() )
        {
            if ( callback.call( this, e.current(), i++ ) === false )
                break;
        }
    },

    array: function()
    {
        var ret = [], e = this.enumerator();
        while ( e.next() )
            ret.push( e.current() );
        return ret;
    }
});

} ( window ) );
