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
        this.reset = function() {
            index = -1;
        };
        this.next = function() {
            return ++index < length ? items[ index ] : null;
        };
    });
};

linq.extend(
{
    select: function( selector )
    {
        var self = this,
            e = self.enumerator();
        return linq.enumerable( function()
        {
            var current = null;
            this.next = function()
            {
                current = e.next();
                if ( current === null )
                    return null;
                return selector.call( self, current );
            };
            this.reset = function() {
                e.reset();
            };
        });
    }
});

linq.extend(
{
    each: function( callback )
    {
        var e = this.enumerator(),
            i = 0,
            current = e.next();
        while ( current !== null )
        {
            if ( callback.call( this, current, i++ ) === false )
                break;
            current = e.next();
        }
    },

    array: function()
    {
        var ret = [],
            e = this.enumerator(),
            current = e.next();
        while ( current !== null )
        {
            ret.push( current );
            current = e.next();
        }
        return ret;
    }
});

} ( window ) );
