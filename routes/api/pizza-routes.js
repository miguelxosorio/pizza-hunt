const router = require('express').Router();
// implement controller methods
// instead of importing the entire object (ex. pizzaController.getAllPizza()), we can destructure the method names out of the imported oobject and use it directly
const {
    getAllPizza,
    getPizzaById,
    createPizza,
    updatePizza,
    deletePizza
} = require('../../controllers/pizza-controller');

//Instead of creating duplicate routes for the individual HTTP methods, we can combine them

// set up GET all and POST at /api/pizzas
router
.route('/')
.get(getAllPizza) // we simply provide the name of the controller method as the callback
.post(createPizza);

// set up GET one, PUT, and DELETE at /api/pizzas/:id
router
.route('/:id')
.get(getPizzaById)
.put(updatePizza)
.delete(deletePizza);

module.exports = router;