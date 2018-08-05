let router = require('express').Router();
let c      = require('./special_modules/commons.js');

router.get('/sign_up', (req, res) =>
{
    return require('./special_modules/sign_up.js')
    .get_sign_up(req)
    .then((json) => c.render_json(json, 'sign_up', res))
    .catch((err) => c.render_json(null, 'sign_up', res, err));
});

router.post('/sign_up', (req, res) =>
{
    return require('./special_modules/sign_up.js')
    .post_sign_up(req)
    .then((json) => c.render_json(json, 'sign_up', res))
    .catch((err) => c.render_json(null, 'sign_up', res, err));
});

module.exports = router;