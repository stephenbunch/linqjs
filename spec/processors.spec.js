describe( ".each()", function()
{
    it( "should execute a callback for each item in an array", function()
    {
        var out = "";
        var indexes = 0;
        linq.from([ "hello", " world", "!" ]).each( function( item, index )
        {
            out += item;
            indexes += index;
        });
        expect( out ).toBe( "hello world!" );
        expect( indexes ).toBe( 3 );
    });
});

describe( ".array()", function()
{
    it( "should convert the enumerable to an array", function()
    {
        expect( linq.from([ 1, 2, 3 ]).array() ).toEqual([ 1, 2, 3 ]);
    });
});

describe( ".first()", function()
{
    it( "should return the first item in the enumeration", function()
    {
        expect( linq.from([ 1, 2, 3 ]).first() ).toBe( 1 );
    });

    it( "should return null if enumeration is empty", function()
    {
        expect( linq.from([]).first() ).toBe( null );
    });
});

describe( ".last()", function()
{
    it( "should get the last item in the enumeration", function()
    {
        expect( linq.from([ 1, 2, 3 ]).last() ).toBe( 3 );
    });

    it( "should return null if enumeration is empty", function()
    {
        expect( linq.from([]).last() ).toBe( null );
    });
});

describe( ".count()", function()
{
    it( "should return the number of items in the enumerable", function()
    {
        expect( linq.from([ 1, 2, 3 ]).count() ).toBe( 3 );
    });
});

describe( ".hash()", function()
{
    it( "can create a hash from an array of key/value pairs", function()
    {
        expect( linq.from({ foo: 2, bar: 3 }).hash() ).toEqual({ foo: 2, bar: 3 });
    });

    it( "can take a key selector", function()
    {
        var data = [
            { name: "Joe", age: 23 },
            { name: "Bob", age: 20 },
            { name: "Sally", age: 21 }
        ];
        expect( linq.from( data ).hash( "|x| x.name" ).Joe.age ).toBe( 23 );
    });

    it( "can take a value selector", function()
    {
        var data = [
            { name: "Joe", age: 23 },
            { name: "Bob", age: 20 },
            { name: "Sally", age: 21 }
        ];
        expect( linq.from( data ).hash( "|x| x.name", "|x| x.age" ).Joe ).toBe( 23 );
    });

    it( "can do without a key selector", function()
    {
        var data = [
            { name: "Joe", age: 23 },
            { name: "Bob", age: 20 },
            { name: "Sally", age: 21 }
        ];
        expect( linq.from( data ).hash( null, "|x| x.age" )[0] ).toBe( 23 );
    });
});

describe( ".contains()", function()
{
    it( "should return true/false if the enumerable contains the item", function()
    {
        var e = linq.from([ 1, 2, 3 ]);
        expect( e.contains( 2 ) ).toBe( true );
        expect( e.contains( 5 ) ).toBe( false );
    });
});

describe( ".any()", function()
{
    it( "should return true/false if the enumerable contains items", function()
    {
        expect( linq.from([ 1 ]).any() ).toBe( true );
        expect( linq.from([]).any() ).toBe( false );
    });
});

describe( ".min()", function()
{
    it( "should return the smallest item", function()
    {
        expect( linq.from([ 3, 2, 1 ]).min() ).toBe( 1 );
    });

    it( "can take a selector", function()
    {
        var data = [
            { x: 1 },
            { x: 2 },
            { x: 0 }
        ];
        expect( linq.from( data ).min( "x => x.x" ) ).toBe( 0 );
    });
});

describe( ".max()", function()
{
    it( "should return the largest item", function()
    {
        expect( linq.from([ 1, 2, 3 ]).max() ).toBe( 3 );
    });

    it( "can take a selector", function()
    {
        var data = [
            { x: 1 },
            { x: 2 },
            { x: 0 }
        ];
        expect( linq.from( data ).max( "x => x.x" ) ).toBe( 2 );
    });
});

describe( ".sum()", function()
{
    it( "should add all the items together", function()
    {
        expect( linq.from([ 1, 2, 3 ]).sum() ).toBe( 6 );
    });

    it( "can take a selector", function()
    {
        var data = [
            { x: 1 },
            { x: 2 },
            { x: 3 }
        ];
        expect( linq.from( data ).sum( "x => x.x" ) ).toBe( 6 );
    });
});
