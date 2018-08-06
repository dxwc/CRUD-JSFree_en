let router = require('express').Router();
let c      = require('./special_modules/commons.js');

router.get('/login', (req, res) =>
{
    return require('./special_modules/login.js')
    .get_login(req)
    .then((json) => c.render_json(json, 'login', res))
    .catch((err) => c.render_json(null, 'login', res, err));
});

router.post('/login', (req, res) =>
{
    return require('./special_modules/login.js')
    .post_login(req)
    .then((json) => c.render_json(json, 'login', res))
    .catch((err) => c.render_json(null, 'login', res, err));
});

module.exports = router;