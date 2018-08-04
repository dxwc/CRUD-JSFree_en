let router = require('express').Router();
let c      = require('./special_modules/commons.js');

router.get('/', (req, res) =>
{
    return require('./special_modules/home.js')(req)
    .then((json) => c.render_json(json, 'home', res))
    .catch((err) => c.render_json(null, 'home', res, err));
});

module.exports = router;