let c      = require('../special_modules/commons.js');

function check_post_id(req)
{
    if
    (
        typeof(req.params.id) !== 'string' ||
        require('validator').escape(req.params.id) !== req.params.id ||
        require('validator').isUUID(req.params.id, 4) !== true
    )
    {
        return Promise.reject
        ({
            is_logged_in : c.is_logged_in(req),
            self_id      : c.get_self_id(req),
            error        : c.error['-9001']
        });
    }
}

function get_post(req, is_for_update)
{
    if(is_for_update) check_post_id(req);

    return new Promise((resolve, reject) =>
    {
        return require('../../db/operation.js')
        .get_post(req.params.id, is_for_update)
        .then((post) =>
        {
            if(typeof(post) !== 'object') return reject('type error');

            let json = {
                is_logged_in : c.is_logged_in(req),
                self_id      : c.get_self_id(req),
                post         : post
            };

            if(is_for_update) json.captcha = c.set_captcha(req);

            return resolve(json);
        })
        .catch((err) =>
        {
            if(err.code !== 0) c.print_error(err);

            return reject
            ({
                is_logged_in : c.is_logged_in(req),
                self_id      : c.get_self_id(req),
                error        : (err.code === 0) ?
                                    c.error['-6000'] :
                                    c.error['-9001']
            });
        });
    });
}

// for post:
function update_post(req)
{
    check_post_id(req);

    let json = {
        is_logged_in : c.is_logged_in(req),
        self_id      : c.get_self_id(req),
        post         : { id : req.params.id }
    }

    return require('../../db/operation.js')
    .get_posted_by_id(req.params.id)
    .then((id) =>
    {
        json.post.posted_by_id = id;

        if(!c.captcha_is_valid(req.body.captcha_solved, req))
        {
            json.error = c.error['1004'];
            json.captcha = c.set_captcha(req);

            if(req.body && req.body.title)
                json.post.title = req.body.title;
            if(req.body && req.body.body)
                json.post.content = req.body.body;

            return json;
        }
        else if
        (
            typeof(req.body.title) !== 'string' ||
            req.body.title.trim().length === 0 ||
            typeof(req.body.body) !== 'string' ||
            req.body.body.trim().length === 0 ||
            typeof(req.body.captcha_solved) !== 'string' ||
            req.body.captcha_solved.trim().length === 0
        )
        {
            json.error = c.error['1401'];
            c.remove_captcha(req);
            return json;
        }
        else
        {
            req.body.title = req.body.title.trim();
            req.body.body = req.body.body.trim();
            req.body.captcha_solved = req.body.captcha_solved.trim();

            return require('../../db/operation.js')
            .update_post(req.body.title, req.body.body, req.params.id)
            .then(() =>
            {
                json.post_id = req.params.id;
                json.info = `Updated post ✓`;
                c.remove_captcha(req);
                return json;
            })
            .catch((err) =>
            {
                throw err;
            });
        }
    })
    .catch((err) =>
    {
        json.error = c.error['-9001'];
        throw err;
    });
}

module.exports.get_post = get_post;
module.exports.update_post = update_post;