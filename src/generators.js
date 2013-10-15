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
