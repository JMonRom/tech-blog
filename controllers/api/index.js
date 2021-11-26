const router = require('express').Router();
const userRoutes = require('./user-routes');

routers.use('/users', userRoutes)

module.exports = router;