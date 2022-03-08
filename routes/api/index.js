// Integrate API routes into the Server - get these hooked into the entire server
// This file will import all of the API routes to prefix their endpoint names and package them up

const router = require('express').Router();
const pizzaRoutes = require('./pizza-routes');

// add prefix of '/pizzas' to routes created in 'pizza-routes.js'
router.use('/pizzas', pizzaRoutes);

module.exports = router;