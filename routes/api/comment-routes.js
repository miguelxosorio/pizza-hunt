const router = require('express').Router();
// import these methods from controller
const { addComment, removeComment, addReply, removeReply } = require('../../controllers/comment-controller');

// api/comments/:pizzaId route
router
    .route('/:pizzaId')
    .post(addComment);

// api/comments/<pizzaId>/<commentId>
router
    .route('/:pizzaId/:commentId')
    .put(addReply)
    .delete(removeComment);

// DELETE route to handle removeReply
router
    .route('/:pizzaId/:commentId/:replyId')
    .delete(removeReply);

module.exports = router;