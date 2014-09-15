describe( ".select()", function()
{
    it( "should return the result from the selector", function()
    {
        expect( linq.from([ 1, 2, 3 ]).select( "x => x * x" ).toArray() ).toEqual([ 1, 4, 9 ]);
    });

    it( "should throw an error if selector is missing", function()
    {
        var e = linq.from();
        expect( function()
        {
            e.select();
        }).toThrow();
    });

    it( "should pass the item index as the second argument", function()
    {
        expect( linq.from([ 100, 101, 102 ]).select( "x, i => i" ).toArray() ).toEqual([ 0, 1, 2 ]);
    });
});

describe( ".where()", function()
{
    it( "should filter the enumeration", function()
    {
        var e = linq.from([ 1, 2, 3, 4 ]).where( function( x ) {
            return x % 2 === 0;
        });
        expect( e.toArray() ).toEqual([ 2,4 ]);
    });

    it( "should pass the item index as the second argument", function()
    {
        expect( linq.from([ 5, 6, 2, 3, 7 ]).where( "x, i => i % 2 === 0" ).toArray() ).toEqual([ 5, 2, 7 ]);
    });

    it( "should take a context parameter", function()
    {
        expect( linq.from([ 1, 2, 3 ]).where( "x => x === this.value", { value: 2 }).toArray() ).toEqual([ 2 ]);
    });
});

describe( ".take()", function()
{
    it( "should take the first 'x' number of items", function()
    {
        expect( linq.from([ 1, 2, 3 ]).take( 2 ).toArray() ).toEqual([ 1,2 ]);
    });
});

describe( ".skip()", function()
{
    it( "should skip the first 'x' number of items", function()
    {
        expect( linq.from([ 1, 2, 3 ]).skip( 2 ).toArray() ).toEqual([ 3 ]);
    });
});

describe( ".step()", function()
{
    it( "should skip every other 'x' item", function()
    {
        expect( linq.from([ 1, 2, 3 ]).step( 2 ).toArray() ).toEqual([ 1,3 ]);
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

        expect( linq.from( items ).groupBy( "|x| x.color" ).toArray() ).toEqual(
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

    it( "should throw an error if selector is missing", function()
    {
        var e = linq.from();
        expect( function()
        {
            e.groupBy();
        }).toThrow();
    });
});

describe( ".union()", function()
{
    it( "should join two enumerables", function()
    {
        expect( linq.from([ 1, 2, 3 ]).union([ 4, 5, 6 ]).toArray() ).toEqual([ 1, 2, 3, 4, 5, 6 ]);
    });
});

describe( ".orderBy()", function()
{
    it( "should sort the items by the specified key", function()
    {
        expect( linq.from([ 3, 1, 2 ]).orderBy( "|x| x" ).toArray() ).toEqual([ 1, 2, 3 ]);
    });

    it( "should provide a .thenBy() method", function()
    {
        expect( linq.from().orderBy( "|x| x" ).thenBy ).toBeDefined();
    });

    it( "should provide a .descending() method", function()
    {
        expect( linq.from().orderBy( "|x| x" ).descending ).toBeDefined();
    });
});

describe( ".thenBy()", function()
{
    it( "should add a subsequent sort to the enumerable", function()
    {
        var data = [{
            first: "Susan",
            last: "Smith"
        }, {
            first: "Sally",
            last: "White"
        }, {
            first: "Adam",
            last: "Smith"
        }, {
            first: "Fred",
            last: "Jones"
        }];
        expect( linq.from( data ).orderBy( "|x| x.last" ).thenBy( "|x| x.first" ).toArray() ).toEqual(
        [{
            first: "Fred",
            last: "Jones"
        }, {
            first: "Adam",
            last: "Smith"
        }, {
            first: "Susan",
            last: "Smith"
        }, {
            first: "Sally",
            last: "White"
        }]);
    });

    it( "should throw an error if selector is missing", function()
    {
        var e = linq.from().orderBy( "|x| x" );
        expect( function()
        {
            e.thenBy();
        }).toThrow();
    });
});

describe( ".descending()", function()
{
    it( "should reverse the sort order", function()
    {
        expect( linq.from([ 1, 2, 3 ]).orderBy( "|x| x" ).descending().toArray() ).toEqual([ 3, 2, 1 ]);
    });

    it( "should not reverse prior sort orders", function()
    {
        var data = [
            [ 1 ],
            [ 2, 2 ],
            [ 3, 3, 3 ]
        ];
        expect( linq.from( data ).orderBy( "|x| x.length" ).thenBy( "|x| x[0]" ).descending().toArray() ).toEqual(
        [
            [ 1 ],
            [ 2, 2 ],
            [ 3, 3, 3 ]
        ]);
    });

    it( "should not provide a descending method", function()
    {
        expect( linq.from().orderBy( "|x| x" ).descending().descending ).not.toBeDefined();
    });
});

describe( ".distinct()", function()
{
    it( "should filter out duplicate items", function()
    {
        expect( linq.from([ 1, 2, 3, 3, 2, 1, 4 ]).distinct().toArray() ).toEqual([ 1, 2, 3, 4 ]);
    });

    it( "can take a selector", function()
    {
        var data = [
            { value: 1 },
            { value: 2 },
            { value: 3 },
            { value: 3 },
            { value: 2 },
            { value: 1 },
            { value: 4 }
        ];
        expect( linq.from( data ).distinct( "|x| x.value" ).toArray() ).toEqual(
        [
            { value: 1 },
            { value: 2 },
            { value: 3 },
            { value: 4 }
        ]);
    });
});

describe( ".reverse()", function()
{
    it( "should reverse the order of the enumerable", function()
    {
        expect( linq.from([ 1, 2, 3 ]).reverse().toArray() ).toEqual([ 3, 2, 1 ]);
    });
});

describe( ".selectMany()", function()
{
    it( "should inline each enumerable item into a single enumerable", function()
    {
        var data = [
            [ 0, 1, 2 ],
            [ 3, 4 ],
            [],
            [ 5 ],
            [ 6, 7 ],
            [ 8, 9, 10 ]
        ];
        expect( linq.from( data ).selectMany( "x => x" ).toArray() ).toEqual([ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]);
    });
});
