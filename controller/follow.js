let router = require('express').Router();
let render = require('./function/render.js');
let op     = require('../model/operations.js');

router.post('/follow/:user_name', (req, res) =>
{
    if(!req.isAuthenticated())
    {
        let obj = {};
        obj.info = `You must be logged in to follow other user`;
        return render(req, res, 'error', obj, false, 400);
    }

    op.create_follow(req.session.passport.user.id, req.params.user_name)
    .then(() =>
    {
        return res.redirect(`/user/` + req.session.passport.user.uname);
    })
    .catch((err) =>
    {
        console.error(err);
        return render
        (
            req,
            res,
            'error',
            { info : 'Unexpected error trying to follow'},
            false,
            500
        );
    });
});

module.exports = router;