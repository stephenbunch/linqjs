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
