const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const fs = require('fs');
const UserPagos = require('../models/pagos/UserPago')
const Owners = require('../models/Owner')

// @desc      Get all userPagos
// @route     GET /api/v1/userPagos
// @access    Private/Admin
exports.getuserPagos = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});




// @desc      Get single userPago
// @route     GET /api/v1/userPagos/:id
// @access    Private/Admin
exports.getuserPago = asyncHandler(async (req, res, next) => {
  const userPago = await UserPagos.findById(req.params.id);

  if (!userPago) {
    return next(
      new ErrorResponse(`UserPago not found with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: userPago,
  });
});

// @desc      Create userPago
// @route     POST /api/v1/userPago
// @access    Private/Admin
exports.createuserPago = asyncHandler(async (req, res, next) => {
  let userPago = null
  const pagoUser = await UserPagos.find({rfc: req.body.rfc})

  if (!pagoUser || pagoUser.length === 0) {
    userPago = await UserPagos.create(req.body)
  } else {
    userPago = await UserPagos.findById(pagoUser[0]._id)
  }


  res.status(201).json({
    success: true,
    data: userPago,
  });
});

// @desc      Update userPago
// @route     PUT /api/v1/userPagos/:id
// @access    Private/Admin
exports.updateuserPago = asyncHandler(async (req, res, next) => {
  let userPago = await UserPagos.findById(req.params.id);

  if (!userPago) {
    return next(
      new ErrorResponse(`userPago not found with the id of ${req.params.id}`, 404)
    );
  }

  // // Make sure user is  userPago
  // if ( req.user.role !== 'admin') {
  //   return next(
  //     new ErrorResponse(
  //       `user ${req.params.id} is not authorized to update this uerPago`,
  //       401
  //     )
  //   );
  // }

  
  userPago = await UserPagos.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: userPago,
  });
});

// @desc      Delete userPago
// @route     DELETE /api/v1/userPagos/:id
// @access    Private/Admin
exports.deleteuserPago = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    deleted: true,
    deletedDate: Date.now(),
  };

  let userPago = await UserPagos.findById(req.params.id);

  if (!userPago) {
    return next(
      new ErrorResponse(`userPago not found with the id of ${req.params.id}`, 404)
    );
  }
  // Make sure user is userPago
  if ( req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.params.id} is not authorized to update this userPago`,
        401
      )
    );
  }

  userPago = await UserPagos.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

 

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc      Update userFormaPago
// @route     POST /api/v1/userpagos/:id
// @access    Private/Admin
exports.agregaFormaPago = asyncHandler(async (req, res, next) => {
  let userPago = await UserPagos.findById(req.params.id);

  if (!userPago) {
    return next(
      new ErrorResponse(`userPago not found with the id of ${req.params.id}`, 404)
    );
  }

  
  userPago = await UserPagos.findByIdAndUpdate(req.params.id, 
    { $push:{"formasPago" : req.body.formasPago[0]} },
    
  {
    new: true,
    runValidators: true,
    // safe: true, upsert: true,
  }
  );


  res.status(200).json({
    success: true,
    data: userPago,
  });
});


// @desc      Update userFormaPago
// @route     PUT /api/v1/userpagos/:id/fpagos
// @access    Private/Admin
exports.updateFormaPago = asyncHandler(async (req, res, next) => {
  let userPago = await UserPagos.findById(req.params.id);

  if (!userPago) {
    return next(
      new ErrorResponse(`userPago not found with the id of ${req.params.id}`, 404)
    );
  }

  userPago.formasPago.pull(req.body.id)
  userPago.save()
  
  userPago = await UserPagos.findByIdAndUpdate(req.params.id, 
    { $push:{"formasPago" : req.body.formasPago[0]} },
    
  {
    new: true,
    runValidators: true,
    // safe: true, upsert: true,
  }
  );


  res.status(200).json({
    success: true,
    data: userPago,
  });
})


exports.deleteFormaPago = asyncHandler(async (req, res, next) => {})