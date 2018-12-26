const model  = require('./index.js');
const val    = require('validator');
const bcrypt = require('bcrypt');
let xss      = require('xss-filters');
let querystr = require('querystring');
let moment   = require('moment');

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
        if(!res || !res[0]) throw res;

        res = res[0];
        if(!for_update)
        {
            Reflect.ownKeys(res).forEach((key) => res[key] = ready(res[key]));
        }
        if(for_update) res.by = ready(res.by);
        res.by = querystr.escape(res.by);
        if(!for_update) res.content = res.content.replace(/\n/g, '<br>');
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
    return model.post.destroy
    ({
        where : { id : id, by : by }
    })
    .catch((err) =>
    {
        throw err;
    });
}

module.exports.sign_up     = sign_up;
module.exports.create_post = create_post;
module.exports.read_post   = read_post;
module.exports.update_post = update_post;
module.exports.delete_post = delete_post;