let router = require('express').Router();
let c      = require('./special_modules/commons.js');

router.get('/logout', (req, res) =>
{
    return require('./special_modules/logout.js')
    .get_logout(req)
    .then((json) => c.render_json(json, 'logout', res))
    .catch((err) => c.render_json(null, 'logout', res, err));
});

router.post('/logout', (req, res) =>
{
    return require('./special_modules/logout.js')
    .post_logout(req)
    .then((json) => c.render_json(json, 'logout', res))
    .catch((err) => c.render_json(null, 'logout', res, err));
});

module.exports = router;