const express  = require('express');
const app      = express();
const passport = require('./controller/middleware/auth.js');
const session  = require('express-session');
const helmet   = require('helmet');

app.use(helmet());
app.use
(
    helmet.contentSecurityPolicy
    ({
        directives:
        {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'"],
            scriptSrc: ["'self'"]
        },
        browserSniff : false
    })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use
(
    session
    ({
        store             : require('./model/index.js').store,
        secret            : process.env.SESSION_SECRET || 'CHANGE_ME',
        resave            : false,
        saveUninitialized : true,
        cookie            :
        {
            httpOnly : false,
            // secure   : true,
            secure   : false,
            maxAge   : null
            // maxAge   : 30 * 24 * 60 * 60 * 1000 // 30 days
        }
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('./view/public/'));

require('ejs').delimiter = '?';
app.set('view engine', 'ejs');
app.set('views', './view/template/');

app.use(require('./controller/middleware/previous.js'));
app.use(require('./controller/'));

let http_server;

require('./model/').connect()
.then(() =>
{
    http_server = app.listen(process.env.PORT || '9001');
    return new Promise((resolve, reject) =>
    {
        http_server.on('listening', () =>
        {
            console.info
            (
                '- HTTP server started,',
                http_server.address().family === 'IPv6' ?
                    'http://[' + http_server.address().address + ']:'
                    + http_server.address().port
                    :
                    'http://' + http_server.address().address + ':'
                    + http_server.address.port
            );
            return resolve();
        });
    });
});


module.exports.app = app;