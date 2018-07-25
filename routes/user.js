let router = require('express').Router();

router.get('/user/:user', (req, res) =>
{
    require('../db/operation.js')
    .get_user_info(req.params.user.trim())
    .then((arr) =>
    {
        return res.render
        (
            'user',
            {
                username : req.params.user.trim(),
                joined : arr[0].joined,
                marker : arr[0].marker
            }
        );
    })
    .catch((err) =>
    {
        console.log(err);
        if(err.code === 0)
        {
            return res
            .render('user', { error : 'No user with that username found'});
        }
        else
        {
            return res.render('user', { error : 'Unhandled error, contact admin' });
        }
    });
});

module.exports = router;