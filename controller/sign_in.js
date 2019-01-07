let router   = require('express').Router();
let passport = require('passport');

let render  = require('./function/render.js');
let captcha = require('./function/captcha.js');
let safe    = require('./function/encode_safe.js');

router.get('/sign_in', (req, res) =>
{
    return render(req, res, 'sign_in', null, true);
});

router.post('/sign_in', (req, res) =>
{
    // Already logged in:
    if(req.isAuthenticated()) return render(req, res, 'sign_in');

    if
    (
        !req.body.hasOwnProperty('user_name') ||
        !req.body.hasOwnProperty('password')
    )
    {
        return res.status(401).send();
    }

    // Check captcha
    if(!captcha.captcha_is_valid(req))
    {
        req.body.info = `Captcha invalid, retry`;
        return render(req, res, 'sign_in', req.body, true, 409);
    }

    if(req.body.user_name)
    {
        req.body.user_name = safe(req.body.user_name);
    }

    passport.authenticate
    (
        'local',
        (err, user, info) =>
        {
            if(err)
            {
                console.log(err);
                req.body.info = `Unexpected error, you may retry or contact admin`;
                return render(req, res, 'sign_in', req.body, true, 500);

            }
            if(!user) /* User not found */
            {
                req.body.info =
                `No such user and password combination found. ` +
                `Double check or re-enter your inputs and then retry`;
                return render(req, res, 'sign_in', req.body, true, 409);
            }
            else
            {
                req.logIn(user, (err) =>
                {
                    if(err)
                    {
                        console.error(err);

                        req.body.info =
                            `Unexpected error, you may retry or contact admin`;
                        return render(req, res, 'sign_in', req.body, true, 500);
                    }
                    else
                    {
                        delete req.session.captcha_solution;
                        return res.status(200).redirect('/');
                    }
                });
            }
        }
    )(req, res);
});

module.exports = router;