let router = require('express').Router();
let render = require('./function/render.js');
let op     = require('../model/operations.js');

router.get('/', async (req, res) =>
{
    try
    {
        if
        (
            !global.front_page ||
            (
                typeof(global.front_page_time) === 'number' &&
                (new Date().getTime() - global.front_page_time > 30000)
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
        }

        return render(req, res, 'home', { posts : global.front_page });
    }
    catch(err)
    {
        console.error(err);
        return render(req, res, 'home');
    }
});

module.exports = router;