describe( "from", function()
{
    it( "should enumerate over an array", function()
    {
        var e = from([ 1, 2, 3 ]).enumerator();
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

    it( "can take an object", function()
    {
        var e = from({ foo: 1, bar: 2 }).enumerator();
        expect( e.next() ).toBe( true );
        expect( e.current() ).toEqual({ key: "foo", value: 1 });
        expect( e.next() ).toBe( true );
        expect( e.current() ).toEqual({ key: "bar", value: 2 });
        expect( e.next() ).toBe( false );
        expect( e.current() ).toBe( null );
    });
});

describe( "times", function()
{
    it( "should create an enumerable with an item for each index", function()
    {
        expect( times( 3 ).array() ).toEqual([ 0, 1, 2 ]);
    });
});

describe( "range", function()
{
    it( "should create an enumerable with an item for each index in the range", function()
    {
        expect( range( 2, 4 ).array() ).toEqual([ 2, 3, 4 ]);
    });

    it( "can take an array", function()
    {
        expect( range([ 2, 4 ]).array() ).toEqual([ 2, 3, 4 ]);
    });
});
