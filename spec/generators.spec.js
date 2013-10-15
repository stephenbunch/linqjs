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
