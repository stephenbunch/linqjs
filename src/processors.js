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
