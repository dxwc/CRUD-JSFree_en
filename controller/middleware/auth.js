let passport = require('passport');
let Lcl      = require('passport-local').Strategy;
let model    = require('../../model/');
let bcrypt   = require('bcrypt');
let xss      = require('xss-filters');
let val      = require('validator');
let querystr = require('querystring');

passport.use
(
    new Lcl
    (
        {
            usernameField : 'user_name',
            passwordField : 'password'
        },
        (uname_given, pass_given, done) =>
        {
            return model.user.findOne
            ({
                where      : { uname : val.escape(uname_given) },
                attributes : ['id', 'upass', 'uname'],
                raw        : true
            })
            .then((res) =>
            {
                if(!res)
                {
                    return done(null, false);
                }
                else
                {
                    res.uname = xss.inHTMLData(val.unescape(res.uname));
                    res.uname = querystr.escape(res.uname);

                    bcrypt.compare(pass_given, res.upass)
                    .then((is_maching) =>
                    {
                        if(!is_maching)
                        {
                            return done(null, false);
                        }
                        else
                        {
                            delete res.upass;
                            return done(null, res);
                        }
                    })
                    .catch((err) => done(err));
                }
            })
            .catch((err) => done(err));
        }
    )
);

passport.serializeUser((user, done) =>
// runs after authentication, user object is recieved from done() from the local
// strtegy setup above
{
    done(null, { id : user.id, uname : user.uname });
    // on requests after user is logged in, the data on second parameter will be
    // saved to req.session.passport
});
passport.deserializeUser((user, done) =>
// runs every subsequest request and gets data from what was returned to done()
// from serializeUser
{
    done(null, true);
    // not passing data here but dummy 'true' as there is no need for duplicate copies
    // of data or hitting db.
    // Note: if the second parameter is not 'truthy', breaks since second parameter
    // is set to req.user and used to check if user is logged in or not
});

module.exports = passport;