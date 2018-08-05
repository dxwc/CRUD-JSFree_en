let c      = require('../special_modules/commons.js');

function get_sign_up(req)
{
    return new Promise((resolve, reject) =>
    {
        c.remove_captcha(req);

        let json = {
            is_logged_in : c.is_logged_in(req),
            self_id      : c.get_self_id(req)
        }

        if(c.is_logged_in(req) === true)
        {
           json.error = c.error['-5000'];
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

function post_sign_up(req)
{
    return new Promise((resolve, reject) =>
    {
        let json = {
            is_logged_in : c.is_logged_in(req),
            self_id      : c.get_self_id(req)
        }

        if(c.is_logged_in(req) === true)
        {
            json.error = c.error['-5000'];
            return resolve(json);
        }

        if
        (
            typeof(req.body.username) !== 'string' ||
            req.body.username.length === 0 ||
            typeof(req.body.password1) !== 'string' ||
            req.body.password1.length === 0 ||
            typeof(req.body.password2) !== 'string' ||
            req.body.password2.length === 0 ||
            typeof(req.body.captcha_solved) !== 'string' ||
            req.body.captcha_solved.length === 0
        )
        {
            json.error = c.error['1401'];
            c.remove_captcha(req);
            return resolve(json);
        }

        req.body.username = req.body.username.trim();
        req.body.captcha_solved = req.body.captcha_solved.trim();

        json.recieved_username = req.body.username;

        if(req.body.username.length < 3 || req.body.username.length > 9)
        {
            json.error = c.error['1001'];
        }
        else if(!c.captcha_is_valid(req.body.captcha_solved, req))
        {
            json.error = c.error['1004'];
        }
        else if(req.body.password1.length < 5)
        {
            json.error = c.error['1002'];
        }
        else if(req.body.password1 !== req.body.password2)
        {
            json.error = c.error['1003'];
        }

        if(json.error)
        {
            json.captcha = c.set_captcha(req);
            return resolve(json);
        }

        require('../../db/operation.js')
        .sign_up(req.body.username, req.body.password1)
        .then((id) =>
        {
            if(id === -1)
            {
                json.error = c.error['1010'];
                json.captcha = c.set_captcha(req);
                return resolve(json);
            }

            c.log_user_in(id, req);

            json.is_logged_in = c.is_logged_in(req);
            json.self_id      = c.get_self_id(req);

            if(json.is_logged_in === false)
                reject(`Signed up but not logged in ???`, json.self_id);

            json.info = `Successfully signed up and logged in`;
            c.remove_captcha(req);

            return resolve(json);
        })
        .catch((err) =>
        {
            c.print_error(err);

            return reject
            ({
                is_logged_in       : c.is_logged_in(req),
                self_id            : c.get_self_id(req),
                error              : c.error['-9001']
            });
        });
    })
    .catch((err) =>
    {
        throw err;
    });
}

module.exports.get_sign_up = get_sign_up;
module.exports.post_sign_up = post_sign_up;