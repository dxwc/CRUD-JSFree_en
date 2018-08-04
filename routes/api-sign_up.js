let router = require('express').Router();
let c      = require('./special_modules/commons.js');

router.get('/api/sign_up', (req, res) =>
{
    return require('./special_modules/sign_up.js')
    .get_sign_up(req)
    .then((json) => c.send_json(json, res))
    .catch((err) => c.send_json(null, res, err));
});

module.exports = router;