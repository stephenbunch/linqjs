describe( "enumerable.each", function()
{
    it( "should execute a callback for each item in an array", function()
    {
        var out = "";
        var indexes = 0;
        from([ "hello", " world", "!" ]).each( function( item, index )
        {
            out += item;
            indexes += index;
        });
        expect( out ).toBe( "hello world!" );
        expect( indexes ).toBe( 3 );
    });
});

describe( "enumerable.array", function()
{
    it( "should convert the enumerable to an array", function()
    {
        expect( from([ 1,2,3 ]).array() ).toEqual([ 1,2,3 ]);
    });
});
