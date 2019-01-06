let router = require('express').Router();
let render = require('./function/render.js');
let op     = require('../model/operations.js');
let val    = require('validator');

router.get('/delete_comment/:id', (req, res) =>
{
    let obj = {};
    if(!req.isAuthenticated())
    {
        obj.info = `You must be signed in reply to delete your comment`;
        return render(req, res, 'error', obj, false, 400);
    }

    if(!val.isUUID(req.params.id, 4))
    {
        obj.info = `No such comment exist that you can reply to`;
        return render(req, res, 'error', obj, false, 500);
    }

    op.read_comment(req.params.id)
    .then((result) =>
    {
        result.info = `Confirm you want to delete the comment: `;
        if(result.commenter === req.session.passport.user.id)
            return render(req, res, 'delete_preview', result);
        else
            return render
            (
                req,
                res,
                'delete_preview',
                {...result, info: `not your comment, can't delete` }
            );
    })
    .catch((err) =>
    {
        console.error(err);
        req.body.info = `Unexpected error, retry or contact admin`;
        return render(req, res, 'delete', null, false, 500);
    })
});

router.post('/confirm_delete/:id', (req, res) =>
{
    if(!req.isAuthenticated() || !val.isUUID(req.params.id, 4))
        return render(req, res, 'error');
    op.delete_comment(req.params.id, req.session.passport.user.id)
    .then(() =>
    {
        if(req.body.post_id) return res.redirect('/post/' + req.body.post_id);
        else                 return render
        (
            req,
            res,
            'error',
            { info :
                `Ignore the error warning. The comment was successfully deleted `}
        );
    })
    .catch((err) =>
    {
        return render(req, res, 'error', { info : `delete failed`}, false, 500);
    });
});

module.exports = router;