let c      = require('../special_modules/commons.js');

function logout(req)
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

module.exports = logout;