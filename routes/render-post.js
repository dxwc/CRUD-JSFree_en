let router = require('express').Router();
let c      = require('./special_modules/commons.js');

router.get('/post/:id', (req, res) =>
{
    return require('./special_modules/post.js')(req)
    .then((json) => c.render_json(json, 'post', res))
    .catch((err) => c.render_json(null, 'post', res, err));
});

module.exports = router;