const express = require('express');
const { login, signin,profile ,logout} = require('../controllers/userAuth');
const verifyToken = require('../verifyToken');

const router = express.Router();

router.post('/login', login);
router.post('/signin', signin);
router.get('/profile', verifyToken,profile);
router.post('/logout', logout);

module.exports = router;
