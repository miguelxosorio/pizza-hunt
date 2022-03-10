// importing the pizza model
const { Pizza } = require('../models');

const pizzaController = {
    // functions as methods
    // five main CRUD methods for the /api/pizzas endpoint routes
    // get all pizzas - GET /api/pizzas
    getAllPizza(req, res) { // will serve as the callback function for the GET/api/pizzas route
        Pizza.find({})
        .populate({             // MongoDB has a populate method to populate a field - pass an object with the key path plus the value of the field you want populated
            path: 'comments',   // we are doing this because we're only seeing the comment ID in the pizza data
            select: '-__v'      // Note that we also used the select option inside of populate(), so that we can tell Mongoose that we don't care about the __v field on comments either
        })                      // The minus sign - in front of the field indicates that we don't want it to be returned.
        .select('-__v')         // update the query to not include the pizza's __v field 
        .sort({ _id: -1 })      // set up the query so that the newest pizza returns first
                                // Mongoose has a .sort() method to help with this, .sort({ _id: -1 }) to sort in DESC order by the _id value. This gets the newest pizza because a timestamp value is hidden somewhere inside the MongoDB ObjectId
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // get one pizza by id - GET /api/pizzas/:id
    getPizzaById({ params }, res) { // Instead of accessing the entire req we destructured params out of it because that's the only data we need for this req to be fulfilled
        Pizza.findOne({ _id: params.id })
        .populate({                 // populates the comment in the pizza data
            path: 'comments', 
            select: '-__v'
        })
        .select('-__v') 
        .then(dbPizzaData => {
            // if no pizza found, send 404
            if(!dbPizzaData) {
                res.status(404).json({ message: `No pizza found with this id!` });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // create pizza - POST /api/pizzas
    createPizza({ body }, res) { //  we destructure the body out of the Express.js req object because we don't need to interface with any of the other data it provides.
        Pizza.create(body)
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => res.status(400).json(err));
    },

    // update pizza by id - PUT /api/pizzas/:id
    updatePizza({ params, body }, res) {
        Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true }) // If we don't set that third parameter, { new: true }, it will return the original document. By setting the parameter to true, we're instructing Mongoose to return the new version of the document.
        .then(dbPizzaData => {
            if(!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.status(400).json(err));
    },

    // delete pizza - DELETE /api/pizzas/:id
    deletePizza({ params }, res) {
        Pizza.findOneAndDelete({ _id: params.id })
        .then(dbPizzaData => {
            if(!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.status(400).json(err));
    }
};

module.exports = pizzaController;