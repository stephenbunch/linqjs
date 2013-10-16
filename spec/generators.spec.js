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

describe( "enumerable.take", function()
{
    it( "should take the first 'x' number of items", function()
    {
        expect( from([ 1,2,3 ]).take( 2 ).array() ).toEqual([ 1,2 ]);
    });
});

describe( "enumerable.skip", function()
{
    it( "should skip the first 'x' number of items", function()
    {
        expect( from([ 1,2,3 ]).skip( 2 ).array() ).toEqual([ 3 ]);
    });
});

describe( "enumerable.step", function()
{
    it( "should skip every other 'x' item", function()
    {
        expect( from([ 1,2,3 ]).step( 2 ).array() ).toEqual([ 1,3 ]);
    });
});
