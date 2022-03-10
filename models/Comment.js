// mongoose dependencies
const { Schema, model, Types } = require('mongoose');
// import dateFormat from utils
const dateFormat = require('../utils/dateFormat');

// Reply Schema - Subdocument array for comments
const ReplySchema = new Schema(
    {   
        // set custom id to avoid confusion with parent comment_id
        // generate the same type of ObjectId() value that the _id field typically does
        replyId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        replyBody: {
            type: String,
            required: true,
            trim: true
        },
        writtenBy: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        }
    },
    {
        toJSON: {
            getters: true
        }
    }
);

// Schema constructor from mongoose - Comment Schema
const CommentSchema = new Schema(
    {
        writtenBy: {
            type: String,
            required: true
        },
        commentBody: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        },
        // associate replies with comments - use ReplySchema to validate data for a reply
        // unlike the relationship between pizza and comment date, replies will be nested directly into the comment's document and not referred to
        replies: [ReplySchema]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);

// Virtual for CommentSchema to get the total reply count
CommentSchema.virtual('replyCount').get(function() {
    return this.replies.length;
});

// Create the Comment model using the CommentSchema
const Comment = model('Comment', CommentSchema);

// export the Comment model
module.exports = Comment;