let router = require('express').Router();
let render = require('./function/render.js');
let op     = require('../model/operations.js');

router.get('/', async (req, res) =>
{
    try
    {
        if(req.query.new)
        {
            if(req.query.page)
            {
                try
                {
                    req.query.page = Math.round(Number(req.query.page) - 1);
                    if(req.query.page < 0) req.query.page = null;
                }
                catch(err)
                {
                    req.query.page = null;
                }
            }

            if(req.query.page && typeof(req.query.page) === 'number')
            {
                temp = await op.front_page
                (true, true, req.query.page * 100);

                return render
                (req, res, 'home', { posts :temp, page : req.query.page + 1 });
            }
            else
            {
                temp = await op.front_page(true, true);
                return render(req, res, 'home', { posts :temp, page : 1 });
            }
        }
        else if
        (
            !global.front_page ||
            (
                typeof(global.front_page_time) === 'number' &&
                (new Date().getTime() - global.front_page_time > 60000)
            )
        )
        {
            let temp = await op.front_page();
            if(temp && temp.constructor === Array && temp.length)
            {
                global.front_page_time = new Date().getTime();
               global.front_page = temp;
               delete temp;
            }

            return render(req, res, 'home', { posts : global.front_page });
        }
        else
        {
            return render(req, res, 'home', { posts : global.front_page });
        }
    }
    catch(err)
    {
        console.error(err);
        return render(req, res, 'home');
    }
});

module.exports = router;