let router = require('express').Router();
let render = require('./function/render.js');
let op     = require('../model/operations.js');
let val    = require('validator');

router.get('/post/:id/delete', async (req, res) =>
{
    function invalid(status)
    {
        return render
        (
            req,
            res,
            'delete_post',
            { info : `You must be signed in and author of the post to edit it`},
            status ? status : 400
        );
    }

    if(!req.isAuthenticated()) return invalid();

    if(!req.params.id.constructor === String || !val.isUUID(req.params.id, 4))
        return invalid();

    if
    (
        !req.query.username ||
        req.query.username.constructor !== String ||
        req.query.username !== req.session.passport.user.uname
    )
        return invalid();

    try
    {
        let post = await op.read_post(req.params.id, true)
        return render(req, res, 'delete_post', post);
    }
    catch(err)
    {
        return invalid(500)
    }
});

router.post('/post/:id/delete', async (req, res) =>
{
    function invalid(status)
    {
        req.body.info = `You must be signed in and author of the post to delete it`;
        return render(req, res, 'delete_post', req.body, status ? status : 400);
    }

    if(!req.isAuthenticated()) return invalid();

    if(req.params.id.constructor !== String || !val.isUUID(req.params.id, 4))
        return invalid();

    try
    {
        await op.delete_post(req.params.id, req.session.passport.user.id)
        return render(req, res, 'deleted', { id : req.params.id });
    }
    catch(err)
    {
        req.body.info = `Unexpected error, relod and retry or contact admin`;
        return render(req, res, 'delete_post', req.body, false, 500);
    }
});

module.exports = router;