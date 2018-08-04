let c      = require('../special_modules/commons.js');

function get_sign_up(req)
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

    return Promise.resolve(json);
}

function post_sign_up(req)
{
    // TODO
}

module.exports.get_sign_up = get_sign_up;
module.exports.post_sign_up = post_sign_up;