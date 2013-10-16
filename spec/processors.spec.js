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

describe( "enumerable.first", function()
{
    it( "should return the first item in the enumeration", function()
    {
        expect( from([ 1,2,3 ]).first() ).toBe( 1 );
    });

    it( "should return null if enumeration is empty", function()
    {
        expect( from([]).first() ).toBe( null );
    });
});

describe( "enumerable.last", function()
{
    it( "should get the last item in the enumeration", function()
    {
        expect( from([ 1,2,3 ]).last() ).toBe( 3 );
    });

    it( "should return null if enumeration is empty", function()
    {
        expect( from([]).last() ).toBe( null );
    });
});

describe( "enumerable.count", function()
{
    it( "should return the number of items in the enumerable", function()
    {
        expect( from([ 1,2,3 ]).count() ).toBe( 3 );
    });
});

describe( "enumerable.hash", function()
{
    it( "can create a hash from an array of key/value pairs", function()
    {
        expect( from({ foo: 2, bar: 3 }).hash() ).toEqual({ foo: 2, bar: 3 });
    });

    it( "can take a key selector", function()
    {
        var data = [
            { name: "Joe", age: 23 },
            { name: "Bob", age: 20 },
            { name: "Sally", age: 21 }
        ];
        expect( from( data ).hash( "|x| x.name" ).Joe.age ).toBe( 23 );
    });

    it( "can take a value selector", function()
    {
        var data = [
            { name: "Joe", age: 23 },
            { name: "Bob", age: 20 },
            { name: "Sally", age: 21 }
        ];
        expect( from( data ).hash( "|x| x.name", "|x| x.age" ).Joe ).toBe( 23 );
    });

    it( "can do without a key selector", function()
    {
        var data = [
            { name: "Joe", age: 23 },
            { name: "Bob", age: 20 },
            { name: "Sally", age: 21 }
        ];
        expect( from( data ).hash( null, "|x| x.age" )[0] ).toBe( 23 );
    });
});

describe( "enumerable.contains", function()
{
    it( "should return true/false if the enumerable contains the item", function()
    {
        var e = from([ 1,2,3 ]);
        expect( e.contains( 2 ) ).toBe( true );
        expect( e.contains( 5 ) ).toBe( false );
    });
});

describe( "enumerable.any", function()
{
    it( "should return true/false if the enumerable contains items", function()
    {
        expect( from([ 1 ]).any() ).toBe( true );
        expect( from([]).any() ).toBe( false );
    });
});
