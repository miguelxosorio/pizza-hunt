// mongoose dependencies
const { Schema, model } = require('mongoose');
// date format import from utils
const dateFormat = require('../utils/dateFormat');

// Schema constructor from mongoose
// Using MongoDB and Mongoose, we simply instruct the schema that this data will adhere to the built-in JavaScript data types, including strings, Booleans, numbers
const PizzaSchema = new Schema(
    {
        pizzaName: {
            type: String
        },
        createdBy: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now,
            // getter in Mongoose
            // everytime we retrieve a pizza, the value in createdAt field will be formatted
            // by the dateFormat() function and used instead of the default timestamp value
            get: createdVal => dateFormat(createdVal)
        },
        size: {
            type: String,
            default: 'Large'
        },
        toppings: [],
        comments: [ // tell mongoose to expect an ObjectId and tell it that its data comes from the Comment model
            {
                type: Schema.Types.ObjectId,
                ref: 'Comment' // The ref property is especially important because it tells the Pizza model which documents to search to find the right comments.
            }
        ]
    },
    {   // tell the schema that it can use virtuals
        toJSON: { 
            virtuals: true,
            // tell Mongoose model that it should use any getter function we've specified
            getters: true
        },
        id: false // We set id to false because this is a virtual that Mongoose returns, and we don’t need it
    }
);

// get total count of comments and replies on retrieval
// Virtuals allow you to add virtual properties to a document that aren't stored in the database
// They're normally computed values that get evaluated when you try to access their properties
PizzaSchema.virtual('commentCount').get(function() {
    return this.comments.length;
})

// create the Pizza model using PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;