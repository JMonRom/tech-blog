const router = require('express').Router();
const apiRoutes = require('./api');
// const homeRoutes = require('./');

// router.use('/', );
router.use('/api', apiRoutes);

module.exports = router;