let router = require('express').Router();
let c      = require('./special_modules/commons.js');

router.post('/logout', (req, res) =>
{
    return require('./special_modules/logout.js')(req)
    .then((json) => c.render_json(json, 'logout', res))
    .catch((err) => c.render_json(null, 'logout', res, err));
});

module.exports = router;