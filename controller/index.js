let router = require('express').Router();

router.use(require('./home.js'));
router.use(require('./sign_up.js'));
router.use(require('./sign_in.js'));
router.use(require('./sign_out.js'));
router.use(require('./create_post.js'));
router.use(require('./read_post.js'));
router.use(require('./update_post.js'));
router.use(require('./delete_post.js'));
router.use(require('./user.js'));
router.use(require('./contact.js'));
router.use(require('./follow.js'));
router.use(require('./admin.js'));
router.use(require('./create_comment.js'));
router.use(require('./delete_comment.js'));
router.use(require('./404.js')); // last route

module.exports = router;