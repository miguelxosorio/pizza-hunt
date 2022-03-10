// mongoose dependencies
const { Schema, model } = require('mongoose');
// date format import from utils
const dateFormat = require('../utils/dateFormat');

// Schema constructor from mongoose
// Using MongoDB and Mongoose, we simply instruct the schema that this data will adhere to the built-in JavaScript data types, including strings, Booleans, numbers
const PizzaSchema = new Schema(
    {
        pizzaName: {
            type: String,
            // require data to exist for that field - Validation
            // can also provide a custom error message ex. required: 'You need to provide a pizza name!'
            required: true,
            // works just like the JavaScript .trim() method and removes white space before and after the input string
            trim: true
        },
        createdBy: {
            type: String,
            required:true,
            trim: true
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
            required: true,
            // the enum option stands for enumerable, a popular term in web development that refers to a set of data that can be iterated over—much like using the for...in loop to iterate through an object
            // provide an array of options that this size field will accept. If a user attempts to enter a pizza size not listed—for example, a size value of "Super Mega Large"—the validation simply won't allow it
            enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
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
    // using the .reduce() method to tally up the total of every comment with its replies
    // .reduce() takes 2 params, an accumulator and a currentValue
    // here the accumulator is total, and currentValue is comment
    // as .reduce() walks through the array, it passes the accumulating total and the current value of comment into the function with the return of the function revising the total for the next iteration through the array
    return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
    // Then .reduce() is used to continually add on to a value within the scope of the method known as the accumulator, then divide by the length of the entire array. The built-in .reduce() method is great for calculating a value based off of the accumulation of values in an array
});

// create the Pizza model using PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;