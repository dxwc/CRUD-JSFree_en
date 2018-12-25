let router = require('express').Router();

router.use(require('./home.js'));
router.use(require('./sign_up.js'));
router.use(require('./sign_in.js'));
router.use(require('./sign_out.js'));
router.use(require('./read_post.js'));
router.use(require('./404.js')); // last route

module.exports = router;