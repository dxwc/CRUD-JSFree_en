let router = require('express').Router();
let render = require('./function/render.js');
let op     = require('../model/operations.js');
let val    = require('validator');
let qr     = require('querystring');

router.get('/post/:id', async (req, res) =>
{
    if(!req.params.id.constructor === String || !val.isUUID(req.params.id, 4))
        return render(req, res, 'read_post');

    try
    {
        let post = await op.read_post(req.params.id);
        post.self_link = qr.escape(`/post/${req.params.id}`);
        return render(req, res, 'read_post', post);
    }
    catch(err)
    {
        return render(req, res, 'read_post');
    }
});

module.exports = router;