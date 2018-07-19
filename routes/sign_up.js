let router = require('express').Router();

function set_captcha_and_send(req, res, error)
{
    let captcha = require('svg-captcha').create();
    req.session.sign_up_captcha = captcha.text;

    return res.render
    (
        'sign_up',
        {
            is_logged_in : typeof(req.session.u_id) === 'string' ? true : false,
            captcha_svg : captcha.data,
            error : error
        }
    );
}

router.get('/sign_up', (req, res) =>
{
    set_captcha_and_send(req, res);
});

router.post('/sign_up', (req, res) =>
{
    if
    (
        typeof(req.body.username) === 'string' &&
        req.body.username.trim().length >= 3 &&
        req.body.username.trim().length <= 15 &&
        typeof(req.body.password1) === 'string' &&
        req.body.password1.trim().length >= 3 &&
        typeof(req.body.password2) === 'string' &&
        req.body.password1.trim() === req.body.password2.trim() &&
        typeof(req.body.captcha_solved) === 'string' &&
        req.body.captcha_solved.trim() === req.session.sign_up_captcha
    )
    {
        require('../db/operation.js')
        .sign_up(req.body.username.trim(), req.body.password1.trim())
        .then((id) =>
        {
            delete req.session.sign_up_captcha;

            req.session.u_id = id;
            return res.render('sign_up', { is_logged_in : true });
        })
        .catch((err) =>
        {
            if(err.message === '-1')
            {
                set_captcha_and_send
                (req, res, 'Username not available, change and retry');
            }
            else
            {
                console.error(err);
                set_captcha_and_send
                (req, res, 'Unknown error, contact admin or retry');
            }
        });
    }
    else
    {
        set_captcha_and_send
        (
            req,
            res,
`Invalid input/s : most likey invlid security code or mismatched password. ` +
`Retry`
        );
    }
});

module.exports = router;