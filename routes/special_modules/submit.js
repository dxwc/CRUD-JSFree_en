let c      = require('../special_modules/commons.js');

function get_submit(req)
{
    return new Promise((resolve, reject) =>
    {
        c.remove_captcha(req);

        let json = {
            is_logged_in : c.is_logged_in(req),
            self_id      : c.get_self_id(req)
        }

        if(c.is_logged_in(req) === false)
        {
           json.error = c.error['-4000'];
        }
        else
        {
            json.captcha = c.set_captcha(req);
        }

        return resolve(json);
    })
    .catch((err) =>
    {
        throw err;
    });
}

function post_submit(req)
{
    return new Promise((resolve, reject) =>
    {
        let json = {
            is_logged_in : c.is_logged_in(req),
            self_id      : c.get_self_id(req)
        }

        if(c.is_logged_in(req) === false)
        {
            json.error = c.error['-4000'];
            return resolve(json);
        }

        if
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
            return resolve(json);
        }

        req.body.title = req.body.title.trim();
        req.body.body = req.body.body.trim();
        req.body.captcha_solved = req.body.captcha_solved.trim();

        json.recieved_title = req.body.title;
        json.recieved_body = req.body.body;

        if(!c.captcha_is_valid(req.body.captcha_solved, req))
        {
            json.error = c.error['1004'];
            json.captcha = c.set_captcha(req);
            return resolve(json);
        }

        require('../../db/operation.js')
        .submit(req.body.title, req.body.body, json.self_id)
        .then((id) =>
        {
            json.post_id = id;
            json.info = `Submitted post ✓`;

            c.remove_captcha(req);
            return resolve(json);
        })
        .catch((err) =>
        {
            c.print_error(err);

            json.error = c.error['-9001'];

            return reject(json);
        });
    })
    .catch((err) =>
    {
        throw err;
    });
}

module.exports.get_submit = get_submit;
module.exports.post_submit = post_submit;