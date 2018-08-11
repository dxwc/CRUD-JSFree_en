let router = require('express').Router();
let c      = require('./special_modules/commons.js');

router.get('/submit', (req, res) =>
{
    return require('./special_modules/submit.js')
    .get_submit(req)
    .then((json) => c.render_json(json, 'submit', res))
    .catch((err) => c.render_json(null, 'submit', res, err));
});

router.post('/submit', (req, res) =>
{
    return require('./special_modules/submit.js')
    .post_submit(req)
    .then((json) => c.render_json(json, 'submit', res))
    .catch((err) => c.render_json(null, 'submit', res, err));
});

module.exports = router;