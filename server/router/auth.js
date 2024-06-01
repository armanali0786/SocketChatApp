const router = require('express').Router();

const { registerValidator,loginValidator } = require('../helpers/validators')

const authController = require('../controller/auth');

router.post('/register', registerValidator(), authController.registerUser);

router.post('/login', loginValidator(),authController.loginUser);

router.get('/logout', authController.logoutUser);

module.exports = router;