const express  = require('express');
const app      = express();
const passport = require('./controller/middleware/auth.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use
(
    require('express-session')
    ({
        secret            : process.env.SESSION_SECRET || 'CHANGE_ME',
        resave            : true,
        saveUninitialized : true
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('./view/public/'));

require('ejs').delimiter = '?';
app.set('view engine', 'ejs');
app.set('views', './view/template/');

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