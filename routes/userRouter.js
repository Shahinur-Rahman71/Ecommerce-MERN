const userCtrl = require('../controllers/userCtrl');
const auth = require('../middleware/auth');
const router = require('express').Router();


router.post('/register', userCtrl.register);

router.post('/login', userCtrl.login);

router.get('/logout', userCtrl.logout);

router.post('/activation', userCtrl.activateEmail);

router.post('/refresh_token', userCtrl.refreshToken);

router.get('/infor', auth, userCtrl.getUser );

router.put('/infor/:id', auth, userCtrl.updateUser ); // update user

router.patch('/addcart', auth, userCtrl.addCart);

router.get('/history', auth, userCtrl.history);

module.exports = router;