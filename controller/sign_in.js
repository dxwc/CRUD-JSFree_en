let router   = require('express').Router();
let passport = require('passport');

let render  = require('./function/render.js');
let captcha = require('./function/captcha.js');

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

    // sign user in at the same time :
    passport.authenticate
    (
        'local',
        (err, user, info) =>
        {
            if(err || !user)
            {
                if(err) console.error(err);

                req.body.info = `Captcha invalid, retry`;
                return render(req, res, 'sign_in', req.body, true, 409);
            }
            else
            {
                req.logIn(user, (err) =>
                {
                    if(err)
                    {
                        console.error(err);

                        req.body.info = `Captcha invalid, retry`;
                        return render(req, res, 'sign_in', req.body, true, 409);
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