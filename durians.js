var eyeEyeEye = "i";

function take_one(a)
{
    var n = Math.floor(Math.random() * a.length);
    var r = a[n];
    a.splice(n, 1);

    return r;
}

function random_taglines()
{
    var adj =  ["robust", "distinct", "sublime"];
    var noun = ["flavor", "odor",     "texture"];

    var tag1 = take_one(adj) + " " + take_one(noun);
    var tag2 = take_one(adj) + " " + take_one(noun);
    var tag3 = take_one(adj) + " " + take_one(noun);

    return [tag1, tag2, tag3];
}

function male_to(tld, user, domain, text)
{
    document.write(
        '<a href="ma' + eyeEyeEye + 'lto:' + user + '@' + domain + '.' + tld + '">'
        + (text ? text : (user + '@' + domain + '.' + tld))
        + '</a>'
    );
}

