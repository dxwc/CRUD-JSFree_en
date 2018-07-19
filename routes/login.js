let router = require('express').Router();

function set_captcha_and_send(req, res, error)
{
    let captcha = require('svg-captcha').create();
    req.session.login_captcha = captcha.text;

    return res.render
    (
        'login',
        {
            is_logged_in : typeof(req.session.u_id) === 'string' ? true : false,
            captcha_svg : captcha.data,
            error : error
        }
    );
}

router.get('/login', (req, res) =>
{
    set_captcha_and_send(req, res);
});

router.post('/login', (req, res) =>
{
    if
    (
        typeof(req.body.username) === 'string' &&
        req.body.username.trim().length >= 3 &&
        req.body.username.trim().length <= 15 &&
        typeof(req.body.password) === 'string' &&
        req.body.password.trim().length >= 3 &&
        req.body.captcha_solved.trim() === req.session.login_captcha
    )
    {
        require('../db/operation.js')
        .login(req.body.username.trim(), req.body.password.trim())
        .then((id) =>
        {
            delete req.session.login_captcha;

            req.session.u_id = id;
            return res.render('login', { is_logged_in : true });
        })
        .catch((err) =>
        {
            if(err.code === 0)
            {
                set_captcha_and_send
                (
                    req,
                    res,
                    `No user with such username and password combination ` +
                    `found, perhaps there was a typo, retry ?`
                );
            }
            else
            {
                console.error(err);
                set_captcha_and_send
                (
                    req,
                    res,
                    `Unknown error, contact admin or retry`
                );
            }
        });
    }
    else if(req.body.captcha_solved.trim() !== req.session.login_captcha)
    {
        set_captcha_and_send
        (
            req,
            res,
            `Security code was wrong, retry`
        );
    }
    else
    {
        set_captcha_and_send
        (
            req,
            res,
            `Invalid inputs. Retry or contact admin`
        );
    }
});

router.get('/logout', (req, res) =>
{
    req.session.destroy();
    res.send('You are now logged out');
});

module.exports = router;