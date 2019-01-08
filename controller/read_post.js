let router = require('express').Router();
let render = require('./function/render.js');
let op     = require('../model/operations.js');
let val    = require('validator');
let qr     = require('querystring');
let thread = require('./function/thread.js');

router.get('/post/:id', async (req, res) =>
{
    if(!req.params.id.constructor === String || !val.isUUID(req.params.id, 4))
        return render(req, res, 'read_post');

    let obj = {};
    try
    {
        obj.post = await op.read_post(req.params.id);
        obj.post.self_link = qr.escape(`/post/${req.params.id}`);
        obj.comments = !req.isAuthenticated() ?
                            thread(await op.get_post_comments(req.params.id)) :
                            thread
                            (
                                await op.get_post_comments(req.params.id),
                                req.session.passport.user.uname
                            );
        return render(req, res, 'read_post', obj);
    }
    catch(err)
    {
        console.log(err);
        return render(req, res, 'read_post', obj, false, 500);
    }
});

module.exports = router;