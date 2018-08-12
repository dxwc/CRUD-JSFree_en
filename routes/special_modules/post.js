let c      = require('../special_modules/commons.js');

function post(req)
{
    if
    (
        typeof(req.params.id) !== 'string' ||
        require('validator').escape(req.params.id) !== req.params.id ||
        require('validator').isUUID(req.params.id, 4) !== true
    )
    {
        return Promise.reject
        ({
            is_logged_in       : c.is_logged_in(req),
            self_id            : c.get_self_id(req),
            error              : c.error['-9001']
        });
    }

    return require('../../db/operation.js')
    .get_post(req.params.id)
    .then((post) =>
    {
        if(typeof(post) !== 'object') throw new Error('type error');

        return {
            is_logged_in       : c.is_logged_in(req),
            self_id            : c.get_self_id(req),
            post               : post
        };
    })
    .catch((err) =>
    {
        if(err.code !== 0) c.print_error(err);

        return {
            is_logged_in : c.is_logged_in(req),
            self_id      : c.get_self_id(req),
            error        : (err.code === 0) ? c.error['-6000'] : c.error['-9001']
        };
    });
}

module.exports = post;