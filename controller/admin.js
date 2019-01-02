let router  = require('express').Router();
let render  = require('./function/render.js');
let captcha = require('./function/captcha.js');
let op      = require('../model/operations.js');

router.get('/check', (req, res) =>
{
    if(req.session.admin !== true) return render(req, res, 'admin', null, true);

    op.read_reports()
    .then((result) =>
    {
        req.session.admin = true;
        return render(req, res, 'admin', { reports : result, admin : true });
    })
    .catch((err) =>
    {
        delete req.session.admin;
        console.log(err);
        return res.send('error');
    });
});

router.post('/check_out', (req, res) =>
{
    delete req.session.admin;
    return res.redirect('/check');
});

router.post('/check', (req, res) =>
{
    if
    (
        req.session.admin !== true &&
        !captcha.captcha_is_valid(req)
    )
    {
        return res.status(400).redirect('/check');
    }

    // TODO: assume env is hashed password. Use bcrypt for password checking
    if
    (
        req.session.admin === true ||
        (
            process.env.user_name &&
            process.env.user_name.constructor === String &&
            process.env.user_name.length > 2 &&
            process.env.password &&
            process.env.password.constructor === String &&
            process.env.password.length > 2 &&
            req.body.user_name === process.env.user_name &&
            req.body.password === process.env.password
        )
    )
    {
        op.read_reports()
        .then((result) =>
        {
            req.session.admin = true;
            return render(req, res, 'admin', { reports : result, admin : true });
        })
        .catch((err) =>
        {
            delete req.session.admin;
            console.log(err);
            return res.send('error');
        });
    }
    else
    {
        delete req.session.admin;
        console.log('wrong');
        return res.send('error');
    }
});

module.exports = router;