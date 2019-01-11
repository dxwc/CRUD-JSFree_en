let router = require('express').Router();
let render = require('./function/render.js');

router.get('/sign_out', (req, res) =>
{
    return render(req, res, 'sign_out');
});

router.post('/sign_out', (req, res) =>
{
    req.logOut();
    req.session.save((err) =>
    {
        if(err) console.error(err);
        return res.redirect(req.session.previous ? req.session.previous : '/');
    });
});

module.exports = router;