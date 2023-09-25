const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Nacimientos = require('../models/Nacimiento');

// @desc      Get all Nacimientos
// @route     GET /api/v1/nacimientos
// @access    Private/Admin
exports.getNacimientos = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single Nacimientos
// @route     GET /api/v1/nacimientos/:id
// @access    Private/Admin
exports.getNacimiento = asyncHandler(async (req, res, next) => {
  const nacimiento = await Nacimientos.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: nacimiento,
  });
});

// @desc      Create nacimiento
// @route     POST /api/v1/nacimientos
// @access    Private/Admin
exports.createNacimiento = asyncHandler(async (req, res, next) => {
  const nacimiento = await Nacimientos.create(req.body);

  res.status(201).json({
    success: true,
    data: nacimiento,
  });
});

// @desc      Update nacimiento
// @route     PUT /api/v1/nacimientos/:id
// @access    Private/Admin
exports.updateNacimiento = asyncHandler(async (req, res, next) => {
  let nacimiento = await Nacimientos.findById(req.params.id);

  if (!nacimiento) {
    return next(
      new ErrorResponse(
        `nacimiento not found with the id of ${req.params.id}`,
        404
      )
    );
  }
  // Make sure user is owner
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.params.id} is not authorized to delete this Nacimientos`,
        401
      )
    );
  }

  nacimiento = await Nacimientos.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: nacimiento,
  });
});

// @desc      Delete nacimiento
// @route     DELETE /api/v1/nacimientos/:id
// @access    Private/Admin
exports.deleteNacimiento = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    deleted: true,
    deletedDate: Date.now(),
  };

  let nacimiento = await Nacimientos.findById(req.params.id);

  if (!nacimiento) {
    return next(
      new ErrorResponse(
        `nacimiento not found with the id of ${req.params.id}`,
        404
      )
    );
  }
  // Make sure user is owner
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.params.id} is not authorized to delete this Nacimientos`,
        401
      )
    );
  }

  nacimiento = await Nacimientos.findByIdAndUpdate(
    req.params.id,
    fieldsToUpdate,
    {
      new: true,
      runValidators: true,
    }
  );

  // await Owners.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});
