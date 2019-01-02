let router = require('express').Router();
let render = require('./function/render.js');
let op     = require('../model/operations.js');

router.get('/user/:user_name', async (req, res) =>
{
    try
    {
        let posts = await op.get_posts(req.params.user_name);

        let following;
        if
        (
            req.isAuthenticated() &&
            req.session.passport.user.uname === req.params.user_name
        )
        {
            following = await op.read_follows(req.session.passport.user.id);
        }

        return render
        (
            req,
            res,
            'user',
            {
                posts     : posts,
                following : following,
                user_name : req.params.user_name
            }
        );
    }
    catch(err)
    {
        return render(req, res, 'user', null, false, 404);
    }
});

module.exports = router;