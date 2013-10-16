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
    },

    /**
     * @description Excludes items that don't match the filter.
     * @param {lambda} filter
     * @returns {Enumerable}
     */
    where: function( filter )
    {
        filter = linq.lambda( filter );
        var self = this, e = self.enumerator();
        return linq.enumerable( function()
        {
            var current = null;
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
    }
});
