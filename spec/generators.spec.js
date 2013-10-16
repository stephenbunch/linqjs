describe( "enumerable.select", function()
{
    it( "should return the result from the selector", function()
    {
        var e = from([ 1,2,3 ]).select( function( x ) {
            return x * x;
        });
        expect( e.array() ).toEqual([ 1,4,9 ]);
    });
});

describe( "enumerable.where", function()
{
    it( "should filter the enumeration", function()
    {
        var e = from([ 1,2,3,4 ]).where( function( x ) {
            return x % 2 === 0;
        });
        expect( e.array() ).toEqual([ 2,4 ]);
    });
});
