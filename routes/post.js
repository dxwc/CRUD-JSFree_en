let router = require('express').Router();
let val    = require('validator');

router.get('/post/:id', (req, res) =>
{
    req.params.id = val.escape(req.params.id);

    if(val.isUUID(req.params.id, 4) === false)
        return res.status(400).send('Invalid request');

    require('../db/operation.js')
    .get_post(req.params.id)
    .then((result) =>
    {
        if
        (
            typeof(result) === 'object' &&
            typeof(result.title) === 'string' &&
            typeof(result.content) === 'string' &&
            typeof(result.published) === 'string' &&
            typeof(result.u_name) === 'string'
        )
        {
            return res.render
            (
                'post',
                {
                    title       : result.title,
                    description : result.content,
                    published   : result.published,
                    by          : result.u_name,
                    marker      : result.marker,
                    post_id     : req.params.id,
                    is_logged_in :
                                typeof(req.session.u_id) === 'string' ? true : false
                }
            );
        }
        else
        {
            console.error
            ('Error: data and data types feteched are not as expected');
            return res.render
            (
                'post',
                {
                    error : 'Unhandled error, retry or contact admin'
                }
            );
        }
    })
    .catch((err) =>
    {
        console.error(err);
        return res.render
        (
            'post',
            {
                error : 'Unhandled error, retry or contact admin'
            }
        );
    });
});

module.exports = router;