let c      = require('../special_modules/commons.js');

function home(req)
{
    return require('../../db/operation.js')
    .get_home_page_list()
    .then((posts) =>
    {
        if(typeof(posts) !== 'object') throw new Error('type error');

        return {
            is_logged_in       : c.is_logged_in(req),
            self_id            : c.get_self_id(req),
            posts              : posts
        };
    })
    .catch((err) =>
    {
        c.print_error(err);

        return {
            is_logged_in       : c.is_logged_in(req),
            self_id            : c.get_self_id(req),
            error              : c.error['-9001']
        };
    });
}

module.exports = home;