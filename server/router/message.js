const router = require('express').Router();


const messageController = require('../controller/message');

router.get('/:id', messageController.getMessage);

router.delete('/:id', messageController.deleteMessage);


module.exports = router;