let db  = require('./connect.js');
let val = require('validator');
let xss = require('xss-filters');
let mom = require('moment');
let uuid = require('uuid');

function get_home_page_list()
{
    return db.query
    (
        `
        SELECT
            s.id,
            s.title,
            s.content,
            s.published,
            s.marker,
            people.u_name
        FROM
            (SELECT
            id, posted_by, title, content, published, marker
            FROM
                submission
            ORDER BY
                published
            LIMIT 20) AS s
        INNER JOIN
            people
        ON
            s.posted_by = people.id
        `
    )
    .then((res) =>
    {
        res.forEach((post) =>
        {
            post.title     = xss.inHTMLData(val.unescape(post.title));
            post.content   = xss.inHTMLData(val.unescape(post.content));
            post.u_name    = xss.inHTMLData(val.unescape(post.u_name));
            post.published = mom.unix(post.published).fromNow();
        });

        return res;
    });
}

function sign_up(username, password)
{
    return db.one
    (
        `
        INSERT INTO people
        (
            id,
            u_name,
            u_pass,
            joined
        )
        VALUES
        (
            '${uuid.v4()}',
            '${val.escape(username)}',
            '${val.escape(password)}',
            ${Math.round(new Date().getTime() / 1000)}
        )
        RETURNING id
        `
    )
    .then((res) =>
    {
        return res.id;
    })
    .catch((err) =>
    {
        if(err.code == '23505') throw new Error('-1'); // username already exists
        else throw err;
    });
}

function login(username, password)
{
    return db.one
    (
        `
        SELECT id
        FROM people
        WHERE
            u_name='${val.escape(username)}' AND
            u_pass='${val.escape(password)}'
        `
    )
    .then((res) =>
    {
        return res.id;
    });
}

function submit(title, description, u_id)
{
    // TODO: detect if description is link, if so save as such with marker

    return db.one
    (
        `
        INSERT INTO submission
        (
            id,
            posted_by,
            title,
            content,
            published
        )
        VALUES
        (
            '${uuid.v4()}',
            '${u_id}',
            '${val.escape(title)}',
            '${val.escape(description)}',
            '${Math.round(new Date().getTime() / 1000)}'
        )
        RETURNING id;
        `
    )
    .then((res) =>
    {
        return res.id;
    });
}

function get_post(id)
{
    return db.one
    (
        `
        SELECT
            u_name,
            s.id,
            s.title,
            s.content,
            s.published,
            s.marker
        FROM
            (SELECT * FROM submission where id='${id}') AS s
        INNER JOIN
            people
        ON
            s.posted_by = people.id
        `
    )
    .then((res) =>
    {
        res.u_name    = xss.inHTMLData(val.unescape(res.u_name));
        res.title     = xss.inHTMLData(val.unescape(res.title));
        res.content   = xss.inHTMLData(val.unescape(res.content));
        res.published = mom.unix(res.published).fromNow();

        return res;
    });
}

module.exports.get_home_page_list = get_home_page_list;
module.exports.sign_up = sign_up;
module.exports.login = login;
module.exports.submit = submit;
module.exports.get_post = get_post;