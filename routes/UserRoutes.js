const {signup,login,profile,getAllUsers,UserPassword}= require('../controllers/User');

const {jwtAuthMiddleware} = require('../middlewares/jwtAuth')

const express = require('express'); 
const router = express.Router();

require('dotenv').config()


router.get('/allusers',getAllUsers)

router.post('/signup',signup)
router.post('/login',login)

router.get('/profile',jwtAuthMiddleware,profile)
router.put('/profile/password',jwtAuthMiddleware,UserPassword);


module.exports = router