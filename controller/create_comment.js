let router = require('express').Router();
let render = require('./function/render.js');
let op     = require('../model/operations.js');
let val    = require('validator');

router.post('/comment', (req, res) =>
{
    if(!req.isAuthenticated())
    {
        req.body.info = `You must be signed in to comment`;
        return render(req, res, 'create_comment', req.body, false, 400);
    }

    if
    (
        !req.body.post_id ||
        !val.isUUID(req.body.post_id, 4) ||
        !req.body.comment_w ||
        !req.body.comment_w.trim().length
    )
    {
        req.body.info = `Invalid or empty input`;
        return render(req, res, 'create_comment', req.body, false, 400);
    }

    op.create_comment
    (
        req.body.post_id,
        req.session.passport.user.id,
        req.body.comment_w.trim()
    )
    .then((id) =>
    {
        return res.redirect('/post/'+req.body.post_id+'#'+id);
    })
    .catch((err) =>
    {
        console.log(err);
        req.body.info = `Unexpected error, retry or contact admin`;
        return render(req, res, 'create_comment', req.body, false, 500);
    });
});

module.exports = router;