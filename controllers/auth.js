const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const awsSes = require('../utils/awsSes');
const speakeasy = require('speakeasy');
const User = require('../models/User');
const qrCode = require('../utils/qrCode');

// @desc    Register User
// @route   Post /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, owner, password, role } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    owner,
    password,
    role,
  });

  // grab token and send to email
  const confirmEmailToken = user.generateEmailConfirmToken();

  // Create reset url
  const confirmEmailURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/confirmemail?token=${confirmEmailToken}`;

  const message = `You are receiving this email because you need to confirm your email address. Please make a GET request to: \n\n ${confirmEmailURL}`;

  user.save({ validateBeforeSave: false });

  const sendResult = await sendEmail({
    email: user.email,
    subject: 'Email confirmation token',
    message,
  });

  sendTokenResponse(user, 200, res);
});

// @desc    Login User
// @route   Post /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & pwd
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  //Check for the user
  const user = await User.findOne({ email: email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Validate email confirmation
  if (!user.isEmailConfirmed) {
    return next(new ErrorResponse('Please confirm your email', 400));
  }

  //Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }
  user.lastLogin = new Date();
  user.save({ validateBeforeSave: false });
  sendTokenResponse(user, 200, res);
});

// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Public
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 1 * 1000),
    httpOnly: true,
  });
  req.headers.aut;

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc      Get current logged in user
// @route     GET /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
  // user is already available in req due to the protect middleware
  const user = req.user;

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Update user details
// @route     PUT /api/v1/auth/updatedetails
// @access    Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    updatedAt: Date.now(),
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Update password
// @route     PUT /api/v1/auth/updatepassword
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Current password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res);
});

// @desc      Forgot password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  const webHost = req.body.hostWeb;
  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  console.log(resetToken);

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${webHost}/auth/resetpassword/${resetToken}`;

  const message = `<html>
<head></head>
<body>
<h1>Hi, ${user.name}</h1>
<br>
  <h1>Reset your password:</h1>
  <p>You are receiving this email because you (or someone else) has requested the reset of a password. Please click the following link or paste it on your browser: 
    ${resetUrl}  
    <a href=${resetUrl}>
      Reset Password </a>.</p>
</body>
</html>`;

  try {
    await awsSes.sendMail({
      emailTo: user.email,
      htmlMessage: message,
      textMessage: '',
      subject: 'Password reset',
      name: user.name,
    });

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:resettoken
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

/**
 * @desc    Confirm Email
 * @route   GET /api/v1/auth/confirmemail
 * @access  Public
 */
exports.confirmEmail = asyncHandler(async (req, res, next) => {
  // grab token from email
  const { token } = req.query;

  if (!token) {
    return next(new ErrorResponse('Invalid Token', 400));
  }

  const splitToken = token.split('.')[0];
  const confirmEmailToken = crypto
    .createHash('sha256')
    .update(splitToken)
    .digest('hex');

  // get user by token
  const user = await User.findOne({
    confirmEmailToken,
    isEmailConfirmed: false,
  });

  if (!user) {
    return next(new ErrorResponse('Invalid Token', 400));
  }

  // update confirmed to true
  user.confirmEmailToken = undefined;
  user.isEmailConfirmed = true;

  // save
  user.save({ validateBeforeSave: false });

  // return token
  sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user,
  });
};

// @desc      2FA Register
// @route     POST /api/v1/auth/faregister
// @access    Private
exports.faregister = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  //Generate secret
  const tempSecret = await speakeasy.generateSecret();
  user.twoFactorCode = tempSecret.base32;
  await user.save({ validateBeforeSave: false });

  const qrcodeStr = `otpauth://totp/lusitanos:${user.email}?secret=${user.twoFactorCode}&issuer=lusitanos&algorithm=SHA1&digits=6&period=30`;

  const codigo = await qrCode({
    name: qrcodeStr,
    color: '000000',
  });

  res.status(200).json({
    success: true,
    data: tempSecret.base32,
    qrcode: codigo,
  });
});

// @desc      2FA Verify
// @route     POST /api/v1/auth/faverify
// @access    Private
exports.faverify = asyncHandler(async (req, res, next) => {
  const { totp } = req.body;
  const user = await User.findById(req.user.id);
  base32secret = user.twoFactorCode;
  //Verify secret
  const verified = await speakeasy.totp.verify({
    secret: base32secret,
    encoding: 'base32',
    token: totp,
    window: 2,
  });

  if (!verified) {
    return next(new ErrorResponse('Invalid Token', 400));
  }

  user.isTwoFactorEnable = verified;
  user.twoFactorCodeExpire = Date.now();
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: verified,
  });
});

// @desc      2FA Disable
// @route     POST /api/v1/auth/fadisable
// @access    Private
exports.fadisable = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse('There is no user with that id', 404));
  }

  user.isTwoFactorEnable = false;
  user.twoFactorCodeExpire = undefined;
  user.twoFactorCode = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: { user: user._id, isTwoFactorEnable: false },
  });
});

// @desc      2FA Validate
// @route     POST /api/v1/auth/favalidate
// @access    Private
exports.favalidate = asyncHandler(async (req, res, next) => {
  const { totp } = req.body;
  const user = await User.findById(req.user.id);
  base32secret = user.twoFactorCode;
  //Verify secret
  const verified = await speakeasy.totp.verify({
    secret: base32secret,
    encoding: 'base32',
    token: totp,
    window: 2,
  });

  if (!verified) {
    return next(new ErrorResponse('Invalid Token', 400));
  }

  res.status(200).json({
    success: true,
    data: verified,
  });
});

// @desc    validate Password
// @route   Post /api/v1/auth/validatepwd
// @access  Private
exports.validatepwd = asyncHandler(async (req, res, next) => {
  const { password } = req.body;
  const email = req.user.email;

  // Validate email & pwd
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  //Check for the user
  const user = await User.findOne({ email: email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  //Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  res.status(200).json({
    success: true,
    data: isMatch,
  });
});
