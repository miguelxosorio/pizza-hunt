// Import the pizza and comment model
const { Pizza, Comment } = require('../models');

const commentController = {
    // add comment to pizza
    addComment({ params, body }, res ){
        console.log(body);
        Comment.create(body)
        .then(({ _id }) => { // returning the pizza Promise here so that we can do something with the results of the Mongoose operation
            console.log(_id)
            return Pizza.findOneAndUpdate( 
                { _id: params.pizzaId }, // when we create a comment, it’s not a standalone comment; it belongs to a pizza
                { $push: { comments: _id } }, // Note here that we're using the $push method to add the comment's _id to the specific pizza we want to update - it adds data to an array
                { new: true } // passed the option of new: true, we're receiving back the updated pizza (the pizza with the new comment included)
            );
        })
        .then(dbPizzaData => { 
            if(!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    },

    // add reply
    addReply({ params, body }, res){
        Comment.findOneAndUpdate(
            { _id: params.commentId },
            { $push: { replies: body } },
            { new: true, runValidators: true }
        )
        .then(dbPizzaData => {
            if(!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    },

    // remove reply
    removeReply({ params }, res) {
        Comment.findOneAndUpdate(
            { _id: params.commentId },
            // using the MongoDB $pull operator to remove the specific reply from the replies array where the replyId matches the value of params.replyId passed in from the route
            { $pull: { replies: { replyId: params.replyId } } },
            { new: true }
        )
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => res.json(err))
    },

    // remove comment - First we'll delete the comment, then we'll use its _id to remove it from the pizza
    removeComment({ params }, res){
        Comment.findOneAndDelete({ _id: params.commentId }) // The first method used here, .findOneAndDelete(), works a lot like .findOneAndUpdate(), as it deletes the document while also returning its data
        .then(deletedComment => {
            if(!deletedComment) {
                return res.status(404).json({ message: 'No comment with this id!' });
            }
            return Pizza.findOneAndUpdate(
                { _id: params.pizzaId },
                { $pull: { comments: params.commentId }}, // We then take that data and use it to identify and remove it from the associated pizza using the Mongo $pull operation
                { new: true }
            ); 
        })
        .then(dbPizzaData => { // Lastly, we return the updated pizza data, now without the _id of the comment in the comments array, and return it to the user
            if(!dbPizzaData){
                res.status(404).json({ message: 'No pizza found with this id!' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    }
};

module.exports = commentController;