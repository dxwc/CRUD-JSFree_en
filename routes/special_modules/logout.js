let c      = require('../special_modules/commons.js');

function get_logout(req)
{
    return Promise.resolve
    ({
        is_logged_in       : c.is_logged_in(req),
        self_id            : c.get_self_id(req)
    })
    .catch((err) =>
    {
        c.print_error(err);
        throw err;
    });
}

function post_logout(req)
{
    try
    {
        c.log_user_out(req);
        return Promise.resolve({ info : 'You are now logged out'});
    }
    catch(err)
    {
        return Promise.resolve({ error : c.error['9999']})
    }
}

module.exports.get_logout = get_logout;
module.exports.post_logout = post_logout;