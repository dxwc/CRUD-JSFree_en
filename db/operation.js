let db  = require('./connect.js');
let val = require('validator');
let xss = require('xss-filters');
let mom = require('moment');
let uuid = require('uuid');
let bcrypt = require('bcrypt');

function get_home_page_list()
{
    return db.query
    (
        `
        SELECT
            s.id,
            s.title,
            -- s.content,
            s.published,
            s.marker,
            people.u_name,
            (SELECT COUNT(*) FROM comment WHERE comment.parent = s.id) as comments
        FROM
            (SELECT
                id,
                posted_by,
                title,
                -- content,
                published,
                marker
            FROM
                submission
            ORDER BY
                published
            LIMIT 20) AS s
        INNER JOIN
            people
        ON
            s.posted_by = people.id
        ORDER BY
            s.published DESC
        `
    )
    .then((res) =>
    {
        res.forEach((post) =>
        {
            post.title     = xss.inHTMLData(val.unescape(post.title));
            // post.content   = xss.inHTMLData(val.unescape(post.content));
            post.posted_by = xss.inHTMLData(val.unescape(post.u_name));
            post.published = mom.unix(post.published).fromNow();
            delete post.u_name;
        });

        return res;
    })
    .catch((err) =>
    {
        throw err;
    });
}

function sign_up(username, password)
{
    return bcrypt.hash(password, 12)
    .then((hashed_password) =>
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
                '${val.escape(hashed_password)}',
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
            if(err.code == '23505') return -1; // username already exists:
            else throw err;
        });
    });

}

function login(username, password)
{
    return db.one
    (
        `
        SELECT id, u_pass
        FROM   people
        WHERE  u_name='${val.escape(username)}'
        `
    )
    .then((res) =>
    {
        return Promise.all
        ([
            bcrypt.compare(password, val.unescape(res.u_pass)),
            res.id
        ]);
    })
    .then((arr) =>
    {
        if(arr[0] === true) return arr[1];
        else                return -1;
    })
    .catch((err) =>
    {
        if(err.code === 0) return -1;
        else               throw err;
    })
}

function submit(title, description, u_id)
{
    // MAYBE: detect if description is link, if so save as such with marker

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
    })
    .catch((err) =>
    {
        throw err;
    });
}

function update_post(title, description, post_id)
{
    return db.none
    (
        `
        UPDATE
            submission
        SET
            title='${val.escape(title)}',
            content='${val.escape(description)}'
        WHERE
            id='${post_id}'
        `
    )
    .catch((err) =>
    {
        throw err;
    });
}

function get_posted_by_id(post_id)
{
    return db.one(`SELECT posted_by FROM submission where id='${post_id}'`)
    .then((res) =>
    {
        return res.posted_by;
    })
    .catch((err) =>
    {
        throw err;
    });
}


function get_post(id, is_for_update)
{
    return db.one
    (
        `
        SELECT
            people.id AS posted_by_id,
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
        res.posted_by = xss.inHTMLData(val.unescape(res.u_name));
        res.title     = xss.inHTMLData(val.unescape(res.title));
        res.content   = xss.inHTMLData(val.unescape(res.content));
        res.published = mom.unix(res.published).fromNow();

        delete res.u_name;

        if(!is_for_update)
        {
            res.content = '<p>' + res.content;
            // res.content = res.content.replace('\r\n', '</p><p>');
            /* https://stackoverflow.com/a/1144788 : */
            res.content =
                res.content.replace(new RegExp('\r\n\r\n', 'g'), '</p><p>');
            res.content += '</p>';
        }

        return res;
    });
}

function get_user_info(username)
{
    return db.one
    (
        `
        SELECT id, joined, marker
        FROM people
        WHERE u_name='${val.escape(username)}'
        `
    )
    .then((res) =>
    {
        res.joined = mom.unix(res.joined).fromNow();
        return Promise.all
        ([
            res,
            db.any
            (
                `
                SELECT title, content, published, marker
                FROM submission
                WHERE posted_by='${res.id}'
                ORDER BY published
                `
            )
            .then((submissions) =>
            {
                submissions.forEach((post) =>
                {
                    post.title     = xss.inHTMLData(val.unescape(post.title));
                    post.content   = xss.inHTMLData(val.unescape(post.content));
                    post.published = mom.unix(post.published).fromNow();
                });

                return submissions;
            })
            ,
            db.any
            (
                `
                SELECT id, content, published
                FROM comment
                WHERE posted_by='${res.id}'
                ORDER BY published
                `
            )
            .then((comments) =>
            {
                comments.forEach((com) =>
                {
                    com.content   = xss.inHTMLData(val.unescape(com.content));
                    com.published = mom.unix(com.published).fromNow();
                });

                return comments;
            })
        ]);
    });
}

module.exports.get_home_page_list = get_home_page_list;
module.exports.sign_up = sign_up;
module.exports.login = login;
module.exports.submit = submit;
module.exports.update_post = update_post;
module.exports.get_posted_by_id = get_posted_by_id;
module.exports.get_post = get_post;
module.exports.get_user_info = get_user_info;