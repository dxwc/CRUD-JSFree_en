let router = require('express').Router();
let c      = require('./special_modules/commons.js');

router.get('/api/login', (req, res) =>
{
    return require('./special_modules/login.js')
    .get_login(req)
    .then((json) => c.send_json(json, res))
    .catch((err) => c.send_json(null, res, err));
});

router.post('/api/login', (req, res) =>
{
    return require('./special_modules/login.js')
    .post_login(req)
    .then((json) => c.send_json(json, res))
    .catch((err) => c.send_json(null, res, err));
});

module.exports = router;