const express = require('express');
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  logout,
  confirmEmail,
  faregister,
  faverify,
  favalidate,
  fadisable,
  validatepwd,
} = require('../controllers/auth');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/confirmemail', confirmEmail);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.get('/logout', logout);
router.post('/faregister', protect, faregister);
router.post('/faverify', protect, faverify);
router.post('/favalidate', protect, favalidate);
router.post('/fadisable', protect, authorize('admin'), fadisable);
router.post('/validatepwd', protect, validatepwd);
module.exports = router;
