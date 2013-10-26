describe( ".select()", function()
{
    it( "should return the result from the selector", function()
    {
        var e = from([ 1, 2, 3 ]).select( function( x ) {
            return x * x;
        });
        expect( e.array() ).toEqual([ 1, 4, 9 ]);
    });
});

describe( ".where()", function()
{
    it( "should filter the enumeration", function()
    {
        var e = from([ 1, 2, 3, 4 ]).where( function( x ) {
            return x % 2 === 0;
        });
        expect( e.array() ).toEqual([ 2,4 ]);
    });
});

describe( ".take()", function()
{
    it( "should take the first 'x' number of items", function()
    {
        expect( from([ 1, 2, 3 ]).take( 2 ).array() ).toEqual([ 1,2 ]);
    });
});

describe( ".skip()", function()
{
    it( "should skip the first 'x' number of items", function()
    {
        expect( from([ 1, 2, 3 ]).skip( 2 ).array() ).toEqual([ 3 ]);
    });
});

describe( ".step()", function()
{
    it( "should skip every other 'x' item", function()
    {
        expect( from([ 1, 2, 3 ]).step( 2 ).array() ).toEqual([ 1,3 ]);
    });
});

describe( ".groupBy()", function()
{
    it( "should group items by key", function()
    {
        var items = [{
            fruit: "lime",
            color: "green"            
        }, {
            fruit: "apple",
            color: "red"
        }, {
            fruit: "watermelon",
            color: "green"
        }, {
            fruit: "blueberry",
            color: "blue"
        }];

        expect( from( items ).groupBy( "|x| x.color" ).array() ).toEqual(
        [{
            key: "green",
            items: [{
                fruit: "lime",
                color: "green"
            }, {
                fruit: "watermelon",
                color: "green"
            }]
        }, {
            key: "red",
            items: [{
                fruit: "apple",
                color: "red"
            }]
        }, {
            key: "blue",
            items: [{
                fruit: "blueberry",
                color: "blue"
            }]
        }]);
    });
});

describe( ".union()", function()
{
    it( "should join two enumerables", function()
    {
        expect( from([ 1, 2, 3 ]).union([ 4, 5, 6 ]).array() ).toEqual([ 1, 2, 3, 4, 5, 6 ]);
    });
});
