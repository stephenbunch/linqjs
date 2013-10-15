var linq = window.linq = {};

var Enumerable = linq.enumerable = function( Enumerator )
{
    if ( !( this instanceof Enumerable ) )
        return new Enumerable( Enumerator );
    this.enumerator = function() {
        return new Enumerator();
    };
};

linq.fn = Enumerable.prototype;
linq.extend = function( methods )
{
    var name;
    for ( name in methods )
    {
        if ( methods.hasOwnProperty( name ) )
            linq.fn[ name ] = methods[ name ];
    }
};

var from = window.from = linq.from = function( items )
{
    return new Enumerable( function()
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
