let set_captcha_get_svg = require('./captcha.js').set_captcha_get_svg;

function render(req, res, ejs_name, obj, send_captcha, status)
{
    return new Promise(async (resolve, reject) =>
    {
        // NOTE: false is used to check sign-in in view
        let uname = req.isAuthenticated() ? req.session.passport.user.uname : false;

        if(obj) obj.name = uname;
        else    obj      = { name : uname }

        if(send_captcha)
        {
            try        { obj.svg = await set_captcha_get_svg(req); }
            catch(err) { console.error(err); }
        }

        res.render(ejs_name, obj, (err, html) =>
        {
            if(err)
            {
                console.error(err);
                return resolve(res.status(500).render('error', obj));
            }
            else
            {
                return resolve
                (
                    res
                    .status(typeof(status) === 'number' ? status : 200)
                    .send(html)
                );
            }
        });
    })
    .catch((err) =>
    {
        console.error(err);
        return res.status(500).render('error', obj);
    });
}

module.exports = render;