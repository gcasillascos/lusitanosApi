const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Cuentas = require('../models/Cuenta');

// @desc      Get all cuentas
// @route     GET /api/v1/cuentas
// @access    Private/Admin
exports.getCuentas = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single cuentas
// @route     GET /api/v1/cuentas/:id
// @access    Private/Admin
exports.getCuenta = asyncHandler(async (req, res, next) => {
  const cuenta = await Cuentas.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: cuenta,
  });
});

// @desc      Create cuenta
// @route     POST /api/v1/cuentas
// @access    Private/Admin
exports.createCuenta = asyncHandler(async (req, res, next) => {
  const cuenta = await Cuentas.create(req.body);

  res.status(201).json({
    success: true,
    data: cuenta,
  });
});

// @desc      Update cuenta
// @route     PUT /api/v1/cuentas/:id
// @access    Private/Admin
exports.updateCuenta = asyncHandler(async (req, res, next) => {
  let cuenta = await Cuentas.findById(req.params.id);

  if (!cuenta) {
    return next(
      new ErrorResponse(`Cuenta not found with the id of ${req.params.id}`, 404)
    );
  }
  // Make sure user is owner
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.params.id} is not authorized to delete this cuentas`,
        401
      )
    );
  }

  cuenta = await Cuentas.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: cuenta,
  });
});

// @desc      Delete cuenta
// @route     DELETE /api/v1/cuentas/:id
// @access    Private/Admin
exports.deleteCuenta = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    deleted: true,
    deletedDate: Date.now(),
  };

  let cuenta = await Cuentas.findById(req.params.id);

  if (!cuenta) {
    return next(
      new ErrorResponse(`Cuenta not found with the id of ${req.params.id}`, 404)
    );
  }
  // Make sure user is owner
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.params.id} is not authorized to delete this cuentas`,
        401
      )
    );
  }

  cuenta = await Cuentas.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  // await Owners.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});
