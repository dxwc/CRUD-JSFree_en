let val = require('validator');
let svg = require('svg-captcha');

function is_logged_in(req)
{
    return (
        typeof(req) === 'object' &&
        typeof(req.session) === 'object' &&
        typeof(req.session.u_id) === 'string' &&
        val.isUUID(req.session.u_id, 4)
    );
}

function get_self_id(req)
{
    if(is_logged_in(req)) return req.session.u_id;
    else return null;
}

function set_captcha(req)
{
    let captcha = svg.create();
    req.session.captcha = captcha.text;

    return captcha.data;
}

function captcha_is_valid(solved_text)
{
    return typeof(req.session.captcha) === 'string' &&
           req.session.captcha === solved_text;
}

function remove_captcha(req)
{
    delete req.session.captcha;
}

function set_and_render(req, res, to_render, error)
{
    return res.render
    (
        to_render,
        {
            is_logged_in : is_logged_in(req),
            captcha_svg : set_captcha(req),
            error : error
        }
    );
}

function print_error(err)
{
    console.error(new Date().getTime());
    console.error(err);
    console.error();
}

error =
{
    '-9001' :
    {
        status : 500,
        message: 'Unhandled error, retry or contact admin'
    }
};

module.exports.is_logged_in = is_logged_in;
module.exports.get_self_id = get_self_id;
module.exports.set_captcha = set_captcha;
module.exports.remove_captcha = remove_captcha;
module.exports.set_and_render = set_and_render;
module.exports.captcha_is_valid = captcha_is_valid;
module.exports.print_error = print_error;
module.exports.error = error;