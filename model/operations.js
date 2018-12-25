const model  = require('./index.js');
const val    = require('validator');
const bcrypt = require('bcrypt');
let xss      = require('xss-filters');
let querystr = require('querystring');

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

function make_post(content, by)
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
    )
    .then((res) => res.id)
    .catch((err) => { throw err; });
}

function get_post(id)
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
            (SELECT * from posts where id='${id}') as posts
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
        if(!res || !res[0]) throw res;

        res = res[0];
        Reflect.ownKeys(res).forEach((key) => res[key] = ready(res[key]));
        res.by = querystr.escape(res.by);
        res.content = res.content.replace(/\n/g, '<br>');

        return res;
    })
    .catch((err) =>
    {
        throw err;
    });
}

module.exports.sign_up = sign_up;
module.exports.make_post = make_post;
module.exports.get_post = get_post;