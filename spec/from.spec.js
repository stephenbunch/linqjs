describe( "from", function()
{
    it( "should enumerate over an array", function()
    {
        var e = from([ 1, 2, 3 ]).enumerator();
        expect( e.next() ).toBe( 1 );
        expect( e.next() ).toBe( 2 );
        expect( e.next() ).toBe( 3 );
        e.reset();
        expect( e.next() ).toBe( 1 );
    });
});
