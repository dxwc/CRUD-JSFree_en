const app  = require('express')();

{
    const path = require('path');

    app.use(require('express').static(path.join(__dirname, 'public')));

    app.use(require('body-parser').urlencoded({ extended: false }));
    app.use(require('body-parser').json()); // to parse application/json

    require('ejs').delimiter = '?';
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'templates'));


    let session = require('express-session');
    app.use
    (
        session
        (
            {
                store: new (require('connect-pg-simple')(session))
                (
                    {
                        pgPromise : require
                                    (path.join(__dirname, 'db', 'connect.js')),
                    }
                ),
                secret: process.env.COOKIE_SECRET || 'default_secretihen8r',
                cookie:
                {
                    // maxAge: 1 * 24 * 60 * 60 * 1000 /* 1 day */
                    maxAge : null
                },
                resave: false,
                saveUninitialized: false
            }
        )
    );


    let fs = require('fs');

    let dir = path.join(__dirname, 'routes');

    fs.readdirSync(dir)
    .forEach((module_name) =>
    {
        let target = path.join(dir, module_name);
        if(!fs.statSync(target).isDirectory()) app.use(require(target));
    });

    // 404.js added last as to serve 404 NOT FOUND message only if no other
    // router can handle the request:
    app.use
    (
        require
        (
            path.join(__dirname, 'routes', 'special_modules', '404.js')
        )
    );
}

console.log
(
    'Listening on',
    app.listen
    (
        process.env.PORT || '9001',
        (err) =>
        {
            if(err) console.error(err);
        }
    )
    .address()
);