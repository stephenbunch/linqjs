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
        return new Enumerable( function()
        {
            var current = null, e = self.enumerator(), i = 0;
            this.current = function() {
                return current;
            };
            this.next = function()
            {
                var ret;
                current = ( ret = e.next() ) ? selector.call( self, e.current(), i++ ) : null;
                return ret;
            };
        });
    },

    /**
     * @description Excludes items that don't match the filter.
     * @param {lambda} filter
     * @param {*} [context]
     * @returns {Enumerable}
     */
    where: function( filter, context )
    {
        filter = linq.lambda( filter, context );
        var self = this;
        return new Enumerable( function()
        {
            var e = self.enumerator(), i = 0;
            this.current = e.current;
            this.next = function()
            {
                while ( e.next() )
                {
                    if ( filter.call( self, e.current(), i++ ) )
                        return true;
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
        return new Enumerable( function()
        {
            var e = self.enumerator(), count = 0;
            this.current = e.current;
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
        return new Enumerable( function()
        {
            var e = self.enumerator(), count = 0;
            this.current = e.current;
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
        return new Enumerable( function()
        {
            var e = self.enumerator(), started = false;
            this.current = e.current;
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
        return new Enumerable( function()
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
        return new Enumerable( function()
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
        var comparer = function( x, y, e )
        {
            if ( e ) e.handled = true;
            var a = selector( x ),
                b = selector( y );
            return a > b ? 1 : a < b ? -1 : 0;
        };
        var ret = new Enumerable( function() {
            return linq.from( self.toArray().sort( comparer ) ).enumerator();
        });
        ret.thenBy = function( selector )
        {
            if ( !selector )
                throw new Error( "A selector is required." );
            selector = linq.lambda( selector );
            var _super = comparer;
            comparer = function( x, y, e )
            {
                var result = _super( x, y );
                if ( result === 0 )
                {
                    if ( e ) e.handled = true;
                    var a = selector( x ),
                        b = selector( y );
                    result = a > b ? 1 : a < b ? -1 : 0;
                }
                return result;
            };
            ret.descending = descending;
            return ret;
        };
        var descending = function()
        {
            var _super = comparer;
            comparer = function( x, y )
            {
                var e = {};
                var result = _super( x, y, e );
                return e.handled ? -1 * result : result;
            };
            delete ret.descending;
            return ret;
        };
        ret.descending = descending;
        return ret;
    },

    distinct: function( selector )
    {
        var self = this;
        selector = linq.lambda( selector );
        function has( items, item )
        {
            if ( items.indexOf )
                return items.indexOf( item ) !== -1;
            var i = 0, len = items.length;
            for ( ; i < len; i++ )
            {
                if ( items[ i ] === item )
                    return true;
            }
            return false;
        }
        return new Enumerable( function()
        {
            var e = self.enumerator(), seen = [];
            this.current = e.current;
            this.next = function()
            {
                while ( e.next() )
                {
                    var current = selector ? selector( e.current() ) : e.current();
                    if ( !has( seen, current ) )
                    {
                        seen.push( current );
                        return true;
                    }
                }
                return false;
            };
        });
    },

    reverse: function()
    {
        var self = this;
        return new Enumerable( function()
        {
            var items = self.toArray(), len = items.length, i = len;
            this.current = function() {
                return i > -1 && i < len ? items[ i ] : null;
            };
            this.next = function() {
                return --i > -1;
            };
        });
    },

    selectMany: function( selector )
    {
        var self = this;
        selector = linq.lambda( selector );
        return new Enumerable( function()
        {
            var e = self.enumerator();
            var current = null;
            this.current = function() {
                return current ? current.current() : null;
            };
            this.next = function()
            {
                while ( true )
                {
                    if ( current === null )
                    {
                        if ( e.next() )
                            current = linq.from( selector ? selector( e.current() ) : e.current() ).enumerator();
                        else
                            return false;
                    }
                    else
                    {
                        if ( current.next() )
                            return true;
                        else
                            current = null;
                    }
                }
            };
        });
    },

    /**
     * @description Joins another collection onto the enumerable.
     * @param {String} [type] The join type. Can be either (left|right|inner). Default is 'inner'.
     * @param {Object|Array|Enumerable} items The collection to join.
     * @param {Lambda|Function} comparer A comparer function to evaluate matches. The comparer takes
     * two arguments 'a' and 'b' where 'a' is the left (source enumerable) value and 'b' is the right
     * (joined collection) value.
     * @returns {Enumerable}
     */
    join: function( type, items, comparer )
    {
        var self = this;
        if ( typeOf( type ) !== 'string' )
        {
            comparer = items;
            items = type;
            type = 'inner';
        }
        if ( !comparer )
        {
            comparer = function( a, b ) {
                return a === b;
            };
        }
        comparer = linq.lambda( comparer );
        return new Enumerable( function()
        {
            var left = self.toArray();
            var right = linq.from( items ).toArray();
            var primary =
                type === "right" ? right :
                type === "left" ? left :
                left.length <= right.length ? left : right;
            var secondary = left === primary ? right : left;
            var length = primary.length;

            var current = null;
            var index = 0;
            var cursor = 0;
            var matches = [];

            this.current = function() {
                return current;
            };

            this.next = function()
            {
                current = null;
                if ( cursor < matches.length )
                {
                    current = matches[ cursor ];
                    cursor++;
                }
                else
                {
                    while ( index < length )
                    {
                        /*jshint loopfunc: true */
                        matches = linq.from( secondary ).where( function( item ) {
                            return comparer(
                                secondary === left ? item : left[ index ],
                                secondary === right ? item : right[ index ]
                            );
                        }).toArray();
                        if ( matches.length === 0 )
                        {
                            if ( type === "left" )
                            {
                                current = [ left[ index ], null ];
                                break;
                            }
                            else if ( type === "right" )
                            {
                                current = [ null, right[ index ] ];
                                break;
                            }
                            else
                            {
                                index++;
                            }
                        }
                        else
                        {
                            /*jshint loopfunc: true */
                            matches = linq.from( matches ).select( function( item ) {
                                return (
                                    secondary === left ?
                                    [ item, right[ index ] ] :
                                    [ left[ index ], item ]
                                );
                            }).toArray();
                            current = matches[ 0 ];
                            cursor = 1;
                            break;
                        }
                    }
                    index++;
                }
                return current !== null;
            };
        });
    },

    pipe: function( transform ) {
        return transform( this );
    }
});
