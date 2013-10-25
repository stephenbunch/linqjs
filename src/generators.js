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
        return linq.enumerable( function()
        {
            var groups = null, i = -1, len = null, keys = [];
            this.current = function() {
                return i < 0 || i >= len ? null : groups[ keys[ i ] ];
            };
            this.next = function()
            {
                if ( groups === null )
                {
                    var e = self.enumerator();
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
                    len = keys.length;
                }
                return ++i < len;
            };
        });
    }
});
