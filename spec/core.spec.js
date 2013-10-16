describe( "from", function()
{
    it( "should enumerate over an array", function()
    {
        var e = from([ 1,2,3 ]).enumerator();
        expect( e.next() ).toBe( true );
        expect( e.current() ).toBe( 1 );
        expect( e.next() ).toBe( true );
        expect( e.current() ).toBe( 2 );
        expect( e.next() ).toBe( true );
        expect( e.current() ).toBe( 3 );
        expect( e.next() ).toBe( false );
        expect( e.current() ).toBe( null );
    });

    it( "should enumerate over false values", function()
    {
        expect( from([ false, 0, null, undefined ]).array() ).toEqual([ false, 0, null, undefined ]);
    });
});
