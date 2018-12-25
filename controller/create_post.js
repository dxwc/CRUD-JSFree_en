let router = require('express').Router();
let render = require('./function/render.js');
let op     = require('../model/operations.js');

router.get('/post', (req, res) =>
{
    return render(req, res, 'create_post');
});

router.post('/post', async (req, res) =>
{
    if(!req.isAuthenticated())
    {
        req.body.info = `You must be signed in to post`;
        return render(req, res, 'create_post', req.body);
    }

    if(!req.body.hasOwnProperty('content'))
    {
        return render(req, res, 'create_post', null, false, 401);
    }

    req.body.content = req.body.content.trim();

    if(!req.body.content.length)
    {
        return render(req, res, 'create_post', null, false, 401);
    }

    try
    {
        let id = await op.create_post
                (req.body.content, req.session.passport.user.id);
        return res.status(200).redirect(`/post/` + id);
    }
    catch(err)
    {
        if(err.code === 'TIME_LIMIT')
        {
            req.body.info = `You must wait before making a new post. Wait ` +
                            `${err.message} more seconds and retry`;
            return render(req, res, 'create_post', req.body, false, 429)
        }

        console.log(req.session.passport, err);
        req.body.info = `Unexpected error, retry or contact admin`;
        return render(req, res, 'create_post', req.body, false, 500);
    }
});

module.exports = router;