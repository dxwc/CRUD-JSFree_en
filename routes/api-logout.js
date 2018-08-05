let router = require('express').Router();
let c      = require('./special_modules/commons.js');

router.post('/api/logout', (req, res) =>
{
    return require('./special_modules/logout.js')
    .post_logout(req)
    .then((json) => c.send_json(json, res))
    .catch((err) => c.send_json(null, res, err));
});

module.exports = router;