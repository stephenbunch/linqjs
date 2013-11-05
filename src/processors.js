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
     * @returns {mixed}
     */
    first: function()
    {
        var e = this.enumerator();
        e.next();
        return e.current();
    },

    /**
     * @description Gets the last item in the enumeration.
     * @returns {mixed}
     */
    last: function()
    {
        var e = this.enumerator();
        var ret = null;
        while ( e.next() )
            ret = e.current();
        return ret;
    },

    /**
     * @description Gets the number of items in the enumerable.
     * @returns {number}
     */
    count: function()
    {
        var e = this.enumerator(), count = 0;
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
                current.key !== undefined ? current.key :
                i;
            value =
                selectValue ? valueSelector.call( self, current ) :
                current.value !== undefined ? current.value :
                current;
            ret[ key ] = value;
            i++;
        }
        return ret;
    },

    /**
     * @description Gets whether the enumerable contains an item.
     * @param {mixed} item
     * @returns {boolean}
     */
    contains: function( item )
    {
        var e = this.enumerator();
        while ( e.next() )
        {
            if ( e.current() === item )
                return true;
        }
        return false;
    },

    /**
     * @description Gets whether the enumerable contains any items.
     * @returns {boolean}
     */
    any: function() {
        return this.first() !== null;
    },

    min: function( selector )
    {
        selector = linq.lambda( selector );
        var ret = null, e = this.enumerator();
        while ( e.next() )
        {
            var current = selector ? selector( e.current() ) : e.current();
            if ( ret === null || current < ret )
                ret = current;
        }
        return ret;
    },

    max: function( selector )
    {
        selector = linq.lambda( selector );
        var ret = null, e = this.enumerator();
        while ( e.next() )
        {
            var current = selector ? selector( e.current() ) : e.current();
            if ( ret === null || current > ret )
                ret = current;
        }
        return ret;
    },

    sum: function( selector )
    {
        selector = linq.lambda( selector );
        var ret = 0, e = this.enumerator();
        while ( e.next() )
            ret += selector ? selector( e.current() ) : e.current();
        return ret;
    }
});
