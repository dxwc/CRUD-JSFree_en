const model  = require('./index.js');
const val    = require('validator');
const bcrypt = require('bcrypt');
let xss      = require('xss-filters');
let querystr = require('querystring');
let moment   = require('moment');
let md       = require('markdown-it')({ breaks: true, linkify : true });

md.disable('link');
md.disable('image');

function ready(input)
{
    if(!input || input.constructor !== String) return input;
    else return xss.inHTMLData(val.unescape(input));
}

function sign_up(user_name, password)
{
    return bcrypt.hash(password, 8)
    .then((hashed_password) =>
    {
        return model.user.create
        (
            {
                uname : val.escape(user_name),
                upass : hashed_password
            },
            {
                attribute : ['id'],
                raw : true
            }
        );
    })
    .then(res => res.id)
    .catch((err) =>
    {
        if(err.parent && err.parent.code === '23505')
        {
            err = new Error('User with that username already exists');
            err.code = 'USER_EXISTS';
            throw err;
        }
        else
        {
            throw err;
        }
    });
}

function create_post(content, by)
{
    return model.post.findAll
    ({
        where : { by : by },
        order : [ [ 'createdAt', 'DESC' ] ],
        attributes : ['createdAt'],
        limit : 1,
        raw : true
    })
    .then((res) =>
    {
        if(!res || !res.length || !res[0].createdAt) return;

        let diff = moment().unix() - moment(res[0].createdAt).unix();

        if(diff >= 180) return;

        let err = new Error(180 - diff);
        err.code = 'TIME_LIMIT'
        throw err;
    })
    .then(() =>
    {
        return model.post.create
        (
            {
                content : val.escape(content),
                by : by
            },
            {
                attribute : ['id'],
                raw : true
            }
        );
    })
    .then((res) => res.id)
    .catch((err) =>
    {
        throw err;
    });
}

function read_post(id, for_update)
{
    return model.sequelize.query
    (
        `
        SELECT
            posts.content,
            users.uname as by,
            posts."createdAt",
            posts."updatedAt"
        FROM
            (SELECT * FROM posts WHERE id='${id}') AS posts
                INNER JOIN
            users
        ON
            users.id = posts.by;
        `,
        {
            type: model.sequelize.QueryTypes.SELECT,
        }
    )
    .then((res) =>
    {
        if(!res || !res[0]) throw new Error(`Post doesn't exists`);

        res = res[0];
        if(!for_update)
        {
            Reflect.ownKeys(res).forEach((key) => res[key] = ready(res[key]));
        }
        if(for_update) res.by = ready(res.by);
        res.by = querystr.escape(res.by);
        if(!for_update) res.content = md.render(res.content);
        res.createdAt = moment(res.createdAt).fromNow();
        res.updatedAt = moment(res.updatedAt).fromNow();
        res.id = id;

        return res;
    })
    .catch((err) =>
    {
        throw err;
    });
}

function update_post(id, content, by)
{
    return model.post.update
    (
        {
            content : content
        },
        {
            where : { id : id, by : by }
        }
    )
    .catch((err) =>
    {
        throw err;
    });
}

function delete_post(id, by)
{
    return model.post.findOne({ where : { id : id, by : by } })
    .then(() => model.comment.destroy({ where : { post_id : id } }))
    .then(() => model.post.destroy({ where : { id : id } }))
    .catch((err) => { throw err; });
}

function get_posts(user_name)
{
    return model.user.findOne
    ({
        where : { uname : val.escape(user_name) },
        attributes : ['id']
    })
    .then((res) =>
    {
        if(!res || !res.id) throw new Error('No such user');
        return model.post.findAll
        ({
            where : { by : res.id },
            order : [ [ 'createdAt', 'DESC' ] ],
            limit : 100,
            raw   : true,
            attributes : ['id', 'createdAt']
        });
    })
    .then((arr) =>
    {
        arr.forEach((res) => res.createdAt = moment(res.createdAt).fromNow())
        return arr;
    })
    .catch((err) =>
    {
        throw err;
    });
}

function get_comments(user_name)
{
    return model.user.findOne
    ({
        where : { uname : val.escape(user_name) },
        attributes : ['id']
    })
    .then((res) =>
    {
        if(!res || !res.id) throw new Error('No such user');
        return model.comment.findAll
        ({
            where : { commenter : res.id },
            order : [ [ 'createdAt', 'DESC' ] ],
            limit : 100,
            raw   : true,
            attributes : ['id', 'post_id', 'createdAt']
        });
    })
    .then((arr) =>
    {
        arr.forEach((res) => res.createdAt = moment(res.createdAt).fromNow())
        return arr;
    })
    .catch((err) =>
    {
        throw err;
    });
}

function create_report(user_name, content)
{
    return model.user.findOne
    ({
        where : { uname : val.escape(user_name) },
        attributes : ['id']
    })
    .then((res) =>
    {
        if(!res || !res.id) throw new Error('No such user');
        return model.report.create
        (
            {
                by : res.id,
                content : val.escape(content)
            },
            {
                raw : true
            }
        );
    })
    .catch((err) =>
    {
        throw err;
    });
}

function report_response(id, response)
{
    return model.report.update
    (
        {
            response : response,
        },
        {
            where : { id : id }
        }
    );
}

function delete_report(id)
{
    return model.report.destroy({ where : { id : id }});
}

function read_reports()
{
    return model.report.findAll()
    .then((res) =>
    {
        if(!res || res.constructor !== Array) return;
        else res.forEach((r) => r.content = md.render(ready(r.content)));

        return res;
    })
    .catch((err) =>
    {
        throw err;
    });
}

function create_follow(user_id, following_name)
{
    return model.user.findOne
    ({
        where : { uname : val.escape(following_name) },
        attributes : ['id'],
        raw : true
    })
    .then((res) =>
    {
        if(!res || !res.id) throw new Error('not found');
        return res.id;
    })
    .then((id) =>
    {
        return model.follow.create
        ({
            user_id : user_id,
            following : id
        },
        {
            raw : true,
            attributes : []
        });
    })
    .catch((err) =>
    {
        if(err.parent && err.parent.code === '23505') return;
        else throw err;
    });
}

function read_follows(user_id)
{
    return model.sequelize.query
    (
        `
        SELECT
            users.uname AS name,
            f."createdAt"
        FROM
            (SELECT * FROM follows WHERE user_id='${user_id}') AS f
                INNER JOIN
            users
        ON
            users.id = f.following;
        `,
        {
            type: model.sequelize.QueryTypes.SELECT,
        }
    )
    .then((res) =>
    {
        if(!res || res.constructor !== Array) throw res;
        res.forEach((u) => u.name = xss.inHTMLData(val.unescape(u.name)));
        return res;
    })
    .catch((err) =>
    {
        throw err;
    });
}

function delete_follow(user_id, following_name)
{
    return model.user.findOne
    ({
        where : { uname : val.escape(following_name) },
        attributes : ['id'],
        raw : true
    })
    .then((res) =>
    {
        if(!res || !res.id) throw new Error('not found');
        return res.id;
    })
    .then((id) =>
    {
        return model.follow.destroy
        ({
            where : { user_id: user_id, following : id }
        });
    })
    .catch((err) =>
    {
        throw err;
    });
}

function front_page()
{
    return model.sequelize.query
    (
        `
        SELECT
            a.id,
            a.content,
            a."createdAt",
            users.uname AS by,
            (SELECT COUNT(*) FROM comments WHERE comments.post_id=a.id) AS replies
        FROM
            (
                SELECT id, content, by,"createdAt"
                FROM posts ORDER BY "createdAt" DESC
                LIMIT 100
            ) AS a
                INNER JOIN
            users
        ON
            users.id = a.by
        ORDER BY
            a."createdAt" DESC;
        `,
        {
            type: model.sequelize.QueryTypes.SELECT,
        }
    )
    .then((arr) =>
    {
        arr.forEach((res) =>
        {
            res.createdAt = moment(res.createdAt).fromNow();
                res.content = res.content.length > 100 ?
                                ready(res.content.substr(0, 100) + ' ...') :
                                ready(res.content);
            res.by = ready(res.by);
        });

        return arr;
    })
    .catch((err) =>
    {
        throw err;
    });
}

function create_comment(post_id, commenter, content, replying_to)
{
    return model.comment.create
    ({
        post_id : post_id,
        commenter : commenter,
        content : val.escape(content),
        replying_to : replying_to ? replying_to : null
    },
    {
        attributes : ['id'],
        raw : true
    })
    .then((res) => res.id)
    .catch((err) => { throw err; });
}

function read_comment(comment_id)
{
    return model.comment.findOne
    (
        {
            where : { id : comment_id },
            raw : true
        }
    );
}

function update_comment(comment_id, content)
{
    return model.comment.update
    (
        {
            content : val.escape(content)
        },
        {
            where : { id : comment_id }
        }
    );
}

function delete_comment(comment_id, commenter)
{
    return model.comment.destroy
    ({
        where : { id : comment_id, commenter : commenter }
    });
}

function get_post_comments(post_id)
{
    return model.sequelize.query
    (
        `
        SELECT
            a.id,
            a.content,
            a."createdAt",
            users.uname AS commenter,
            a.replying_to,
            a.post_id
        FROM
            (
                SELECT id, content, commenter, "createdAt", replying_to, post_id
                FROM comments
                WHERE post_id='${post_id}'
                ORDER BY "createdAt" DESC
                LIMIT 100
            ) AS a
                INNER JOIN
            users
        ON
            users.id = a.commenter
        ORDER BY
            a."createdAt" ASC;
        `,
        {
            type: model.sequelize.QueryTypes.SELECT,
        }
    )
    .then((arr) =>
    {
        arr.forEach((res) =>
        {
            res.createdAt = moment(res.createdAt).fromNow();
            res.content = md.render(ready(res.content));
            res.commenter = ready(res.commenter);
        });

        return arr;
    })
    .catch((err) =>
    {
        throw err;
    });
}

module.exports.sign_up           = sign_up;
module.exports.create_post       = create_post;
module.exports.read_post         = read_post;
module.exports.update_post       = update_post;
module.exports.delete_post       = delete_post;
module.exports.get_posts         = get_posts;
module.exports.get_comments      = get_comments;
module.exports.create_report     = create_report;
module.exports.report_response   = report_response;
module.exports.delete_report     = delete_report;
module.exports.read_reports      = read_reports;
module.exports.create_follow     = create_follow;
module.exports.read_follows      = read_follows;
module.exports.delete_follow     = delete_follow;
module.exports.front_page        = front_page;
module.exports.create_comment    = create_comment;
module.exports.read_comment      = read_comment;
module.exports.update_comment    = update_comment;
module.exports.delete_comment    = delete_comment;
module.exports.get_post_comments = get_post_comments;