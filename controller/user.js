let router = require('express').Router();
let render = require('./function/render.js');
let op     = require('../model/operations.js');

router.get('/user/:user_name', async (req, res) =>
{
    try
    {
        let posts = await op.get_posts(req.params.user_name);
        return render
        (
            req,
            res,
            'user',
            { posts : posts, user_name : req.params.user_name }
        );
    }
    catch(err)
    {
        return render(req, res, 'user', null, false, 404);
    }
});

module.exports = router;