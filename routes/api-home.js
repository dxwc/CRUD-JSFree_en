let router = require('express').Router();
let c      = require('./special_modules/commons.js');

router.get('/api/home', (req, res) =>
{
    require('./special_modules/home.js')(req)
    .then((json) => c.send_json(json, res))
    .catch((err) => c.send_json(null, res, err));
});

module.exports = router;