function really_unescape(s)
{
    return unescape(s.replace(/\+/g, " "));
}

function query_params(s)
{
    if (s.substr(0,1) == "?")
        s = s.substr(1, s.length-1);

    var params = s.split("&");
    var r = {};

    for (var i = 0; i < params.length; ++i) {
        var kv = params[i].split("=", 2);
        r[kv[0]] = really_unescape(kv[1]);
    }
    return r;
}

function fill_text(id, str, dflt)
{
    var s = str || dflt;
    var node = document.createTextNode(s);
    document.getElementById(id).appendChild(node);
}

function make_comic()
{
    var query = query_params(document.location.search || '');

    fill_text('byline', query['byline'], '<byline>');
    fill_text('strawman-says', query['strawman'], '<strawman>');
    fill_text('pinhead-says', query['pinhead'], '<pinhead>');
}
