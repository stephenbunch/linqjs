describe( "from()", function()
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

    it( "can take an enumerable", function()
    {
        expect( from( from([ 1, 2, 3 ]) ).array() ).toEqual([ 1, 2, 3 ]);
    });

    it( "can take nothing", function()
    {
        expect( from().array() ).toEqual( [] );
    });
});

describe( "times()", function()
{
    it( "should create an enumerable with an item for each index", function()
    {
        expect( times( 3 ).array() ).toEqual([ 0, 1, 2 ]);
    });
});

describe( "range()", function()
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

describe( "linq.lambda()", function()
{
    it( "should throw an error if expression is invalid", function()
    {
        expect( function()
        {
            linq.lambda( "x" );
        }).toThrow( "Not a valid lambda expression. Example: x => x.foo" );

        expect( function()
        {
            linq.lambda( "=> x" );
        }).toThrow( "Lambda signature missing. For a parameterless signature, use: () => 42" );

        expect( function()
        {
            linq.lambda( "() =>" );
        }).toThrow( "Lambda must return something." );

        expect( function()
        {
            linq.lambda( "a b => a" );
        }).toThrow( "Lambda signature is invalid." );

        expect( function()
        {
            linq.lambda( "2a => 2a" );
        }).toThrow( "Lambda signature is invalid." );
    });

    it( "should return the compiled expression as a function", function()
    {
        expect( linq.lambda( "x => x.foo" )({ foo: 2 }) ).toBe( 2 );
        expect( linq.lambda( "$x => $x.foo" )({ foo: 2 }) ).toBe( 2 );
        expect( linq.lambda( "a, b => a + b" )( 2, 4 ) ).toBe( 6 );
        expect( linq.lambda( "(x1) => 'hello ' + x1" )( "world" ) ).toBe( "hello world" );
        expect( linq.lambda( "_x => _x ? 'foo' : 'spam'" )( true ) ).toBe( "foo" );
    });

    it( "should support the c# lambda syntax", function()
    {
        expect( linq.lambda( "a, b => a + b" )( 8, 16 ) ).toBe( 24 );
    }); 

    it( "should support the ruby lambda syntax", function()
    {
        expect( linq.lambda( "|a, b| a + b" )( 8, 16 ) ).toBe( 24 );
    });

    it( "should support the '=>' symbol in the body", function()
    {
        expect( linq.lambda( "() => '=>'" )() ).toBe( "=>" );
    });
});
