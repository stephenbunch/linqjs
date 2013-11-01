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
     * @returns {Enumerable}
     */
    where: function( filter )
    {
        filter = linq.lambda( filter );
        var self = this;
        return linq.enumerable( function()
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
        return linq.enumerable( function()
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
        return linq.enumerable( function()
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
        return linq.enumerable( function()
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
        return linq.enumerable( function()
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
        return linq.enumerable( function()
        {
            var items = self.array(), len = items.length, i = len;
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
        return linq.enumerable( function()
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
                            current = from( selector ? selector( e.current() ) : e.current() ).enumerator();
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
    }
});
