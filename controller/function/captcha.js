let svg_captcha = require('svg-captcha');

function captcha_is_valid(req)
{
    return req.body.captcha&&
        req.body.captcha.constructor === String &&
        req.body.captcha === req.session.captcha_solution;
}

function set_captcha_get_svg(req)
{
    return new Promise((resolve, reject) =>
    {
        let captcha = svg_captcha.create();
        req.session.captcha_solution = captcha.text;
        return resolve(captcha.data);
    })
    .catch((err) =>
    {
        throw err;
    });
}

module.exports.captcha_is_valid    = captcha_is_valid;
module.exports.set_captcha_get_svg = set_captcha_get_svg;