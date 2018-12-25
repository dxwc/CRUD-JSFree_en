let router = require('express').Router();
let render = require('./function/render.js');

router.get('/', (req, res) =>
{
    return render(req, res, 'home', null, true);
});

module.exports = router;