let router = require('express').Router();
let render = require('./function/render.js');
let qr     = require('querystring');
let op     = require('../model/operations.js');

router.get('/contact/', (req, res) =>
{
    return render(req, res, 'contact');
});

router.get('/contact/:link', (req, res) =>
{
    if(req.params.link && req.params.link.trim().length)
    {
        return render
        (
            req,
            res,
            'contact',
            {
                content : `\n\n\nConcerning: `
                          + qr.unescape(req.params.link.trim())
                          + '\n'
            }
        );
    }

    return render(req, res, 'contact');
});

router.post('/contact', (req, res) =>
{
    if(!req.isAuthenticated())
    {
        req.body.info = `You must be signed in to send report here`;
        return render(req, res, 'contact', req.body, false, 400);
    }
    else if(!req.body.content.trim().length)
    {
        req.body.info = `Invalid input, retry`;
        return render(req, res, 'contact', req.body, false, 400);
    }
    else
    {
        op.create_report(req.session.passport.user.uname, req.body.content)
        .then(() =>
        {
            return render(req, res, 'contact_confirm');
        })
        .catch((err) =>
        {
            console.error(err);
            req.body.info = `Unexpected error, retry, or use email to contact`;
            return render(req, res, 'contact', req.body, false, 500);
        });
    }
});

module.exports = router;