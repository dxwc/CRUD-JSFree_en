let router = require('express').Router();

router.get('/', (req, res) =>
{
    require('../db/operation.js').get_home_page_list()
    .then((result) =>
    {
        return res.render
        (
            'home',
            {
                is_logged_in : typeof(req.session.u_id) === 'string' ? true : false,
                list : result
            }
        );
    })
    .catch((err) =>
    {
        console.error(err);
        res.status(500).send('ERROR FETCHING POST LIST CONTENT, CONTACT ADMIN');
    });

});

module.exports = router;