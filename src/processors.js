linq.extend(
{
    /**
     * @description Executes a callback for each item in the enumeration.
     * @param {function} callback
     */
    each: function( callback )
    {
        var e = this.enumerator(), i = 0;
        while ( e.next() )
        {
            if ( callback.call( this, e.current(), i++ ) === false )
                break;
        }
    },

    /**
     * @description Converts the enumerable into an array.
     * @returns {array}
     */    
    array: function()
    {
        var ret = [], e = this.enumerator();
        while ( e.next() )
            ret.push( e.current() );
        return ret;
    },

    /**
     * @description Gets the first item in the enumeration.
     * @param {lambda} [filter]
     * @returns {mixed}
     */
    first: function( filter )
    {
        filter = linq.lambda( filter );
        var e = filter ? this.where( filter ).enumerator() : this.enumerator();
        e.next();
        return e.current();
    },

    /**
     * @description Gets the number of items in the enumerable.
     * @param {lambda} [filter]
     * @returns {number}
     */
    count: function( filter )
    {
        filter = linq.lambda( filter );
        var e = filter ? this.where( filter ).enumerator() : this.enumerator(),
            count = 0;
        while ( e.next() )
            count++;
        return count;
    },

    /**
     * @description Converts the enumerable into an object.
     * @param {lambda} [keySelector]
     * @param {lambda} [valueSelector]
     * @returns {object}
     */
    hash: function( keySelector, valueSelector )
    {
        var self = this,
            ret = {},
            e = this.enumerator(),
            selectKey = arguments.length > 0 && !!keySelector,
            selectValue = arguments.length > 1,
            i = 0,
            key, value, current;

        keySelector = linq.lambda( keySelector );
        valueSelector = linq.lambda( valueSelector );

        while ( e.next() )
        {
            current = e.current();
            key =
                selectKey ? keySelector.call( self, current ) :
                current.hasOwnProperty( "key" ) && current.key !== undefined ? current.key :
                i;
            value =
                selectValue ? valueSelector.call( self, current ) :
                current.hasOwnProperty( "value" ) && current.value !== undefined ? current.value :
                current;
            ret[ key ] = value;
            i++;
        }
        return ret;
    }
});
