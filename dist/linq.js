/*!
 * linqjs v0.1.0
 * (c) 2013 Stephen Bunch https://github.com/stephenbunch/linqjs
 * License: MIT
 */
( function ( window, undefined ) {

"use strict";

var linq = window.linq = {};

var Enumerable = function( Enumerator )
{
    this.enumerator = function() {
        return new Enumerator();
    };
};

var enumerable = linq.enumerable = function( Enumerator ) {
    return new Enumerable( Enumerator );
};

var from = window.from = linq.from = function( items )
{
    return enumerable( function()
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

} ( window ) );
