let router = require('express').Router();
let c      = require('./special_modules/commons.js');

router.get('/post/edit/:id', (req, res) =>
{
    return require('./special_modules/post.js')
    .get_post(req, true)
    .then((json) => c.render_json(json, 'update_post', res))
    .catch((err) => c.render_json(null, 'update_post', res, err));
});

router.post('/post/edit/:id', (req, res) =>
{
    return require('./special_modules/post.js')
    .update_post(req)
    .then((json) => c.render_json(json, 'update_post', res))
    .catch((err) => c.render_json(null, 'update_post', res, err));
});

module.exports = router;