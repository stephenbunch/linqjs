if ( typeof module !== "undefined" && module.exports )
{
    module.exports = linq;
}
else if ( typeof define === "function" && define.amd )
{
    define( function() {
        return linq;
    });
}
else
{
    global.linq = linq;
}
