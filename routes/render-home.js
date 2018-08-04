let router = require('express').Router();

router.get('/', (req, res) =>
{
    require('./special_modules/home.js')(req)
    .then((json) =>
    {
        res.render('home', json);
    })
    .catch((err) =>
    {
        console.error('>>>', err);
        res.status(500).send('Unexpected Error, retry or contact admin');
    });
});

module.exports = router;