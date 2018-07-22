let router = require('express').Router();

function set_captcha_and_send(req, res, error, data, status)
{
    let captcha = require('svg-captcha').create();
    req.session.submit_captcha = captcha.text;

    res.status(typeof(status) === 'number' ? status : 200);

    return res.render
    (
        'submit',
        {
            is_logged_in : typeof(req.session.u_id) === 'string' ? true : false,
            captcha_svg : captcha.data,
            error : error,
            data : data
        }
    );
}

router.get('/submit', (req, res) =>
{
    set_captcha_and_send(req, res);
});

router.post('/submit', (req, res) =>
{
    if
    (
        typeof(req.session.u_id) === 'string' &&
        req.session.u_id.length &&
        typeof(req.body.title) === 'string' &&
        req.body.title.trim().length &&
        typeof(req.body.description) === 'string' &&
        req.body.description.trim().length &&
        typeof(req.body.captcha_solved) === 'string' &&
        req.body.captcha_solved.length
    )
    {
        if(req.body.captcha_solved !== req.session.submit_captcha)
        {
            set_captcha_and_send
            (
                req,
                res,
                'Retry the security code',
                {
                    title : req.body.title.trim(),
                    description : req.body.description.trim()
                }
            );
        }
        else
        {
            require('../db/operation.js')
            .submit
            (
                req.body.title.trim(),
                req.body.description.trim(),
                req.session.u_id
            )
            .then((id) =>
            {
                return res.redirect(`/post/${id}`);
            })
            .catch((err) =>
            {
                console.error(err);
                set_captcha_and_send
                (
                    req,
                    res,
                    'There was an insertion error, retry or contact admin',
                    {
                        title : req.body.title.trim(),
                        description : req.body.description.trim()
                    }
                );
            });
        }
    }
    else
    {
        set_captcha_and_send
        (req, res, 'Invalid inputs, retry or contact admin', 400);
    }
});

module.exports = router;