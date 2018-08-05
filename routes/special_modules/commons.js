let val = require('validator');
let svg = require('svg-captcha');

function log_user_in(id, req)
{
    if(typeof(id) === 'string' && val.isUUID(id))
    {
        req.session.u_id = id;
    }
}

function log_user_out(req)
{
    req.session.destroy((err) =>
    {
        print_error(err);
    });
}

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

function captcha_is_valid(solved_text, req)
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
    },
    '-5000' :
    {
        status : 200,
        message : 'You are already logged in, no need to sign up'
    },
    '1401' :
    {
        status : 400,
        message : 'Invalid request / data'
    },
    '1001' :
    {
        status : 400,
        message : 'Username must be longer than 2 characters and smaller than 10'
    },
    '1002' :
    {
        status : 400,
        message : 'Passwords must be longer than 4 characters'
    },
    '1003' :
    {
        status : 400,
        message : 'Both passwords must be the same'
    },
    '1004' :
    {
        status : 400,
        message : 'Security/Captcha text entered was invalid, retry'
    },
    '1010' :
    {
        status : 200,
        message : 'Username is taken, change and retry'
    },
    '9999' :
    {
        status : 500,
        message : `Error logging out, retry or try deleting cache`
    }
};

function send_json(json, res, err)
{
    if(err)
    {
        print_error(err);
        return res.status(500).send('Unexpected error, retry or contact admin');
    }
    else if
    (
        typeof(json) === 'object' &&
        typeof(json.error) === 'object' &&
        typeof(json.error.status) === 'string' &&
        val.isNumeric(json.error.status)
    )
    {
        return res.status(json.error.status).send(json);
    }
    else if(typeof(json) === 'object')
    {
        return res.status(200).send(json);
    }
    else
    {
        return res.status(500).send('Unexpected error, retry or contact admin');
    }
}

function render_json(json, to_render, res, err)
{
    if(err)
    {
        print_error(err);
        return res.status(500).send('Unexpected error, retry or contact admin');
    }
    else if
    (
        typeof(json) === 'object' &&
        typeof(json.error) === 'object' &&
        typeof(json.error.status) === 'string' &&
        val.isNumeric(json.error.status)
    )
    {
        return res.status(json.error.status).render(to_render, json);
    }
    else if(typeof(json) === 'object')
    {
        return res.status(200).render(to_render, json);
    }
    else
    {
        return res.status(500).send('Unexpected error, retry or contact admin');
    }
}

module.exports.log_user_in = log_user_in;
module.exports.log_user_out = log_user_out;
module.exports.is_logged_in = is_logged_in;
module.exports.get_self_id = get_self_id;
module.exports.set_captcha = set_captcha;
module.exports.remove_captcha = remove_captcha;
module.exports.set_and_render = set_and_render;
module.exports.captcha_is_valid = captcha_is_valid;
module.exports.print_error = print_error;
module.exports.error = error;
module.exports.send_json = send_json;
module.exports.render_json = render_json;