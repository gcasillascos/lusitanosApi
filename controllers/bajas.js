const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bajas = require('../models/Baja');

// @desc      Get all Bajas
// @route     GET /api/v1/edoctas
// @access    Private/Admin
exports.getBajas = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single Bajas
// @route     GET /api/v1/edoctas/:id
// @access    Private/Admin
exports.getBaja = asyncHandler(async (req, res, next) => {
  const baja = await Bajas.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: baja,
  });
});

// @desc      Create baja
// @route     POST /api/v1/edoctas
// @access    Private/Admin
exports.createBaja = asyncHandler(async (req, res, next) => {
  const baja = await Bajas.create(req.body);

  res.status(201).json({
    success: true,
    data: baja,
  });
});

// @desc      Update baja
// @route     PUT /api/v1/edoctas/:id
// @access    Private/Admin
exports.updateBaja = asyncHandler(async (req, res, next) => {
  let baja = await Bajas.findById(req.params.id);

  if (!baja) {
    return next(
      new ErrorResponse(
        `baja not found with the id of ${req.params.id}`,
        404
      )
    );
  }
  // Make sure user is owner
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.params.id} is not authorized to delete this Bajas`,
        401
      )
    );
  }

  baja = await Bajas.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: baja,
  });
});

// @desc      Delete baja
// @route     DELETE /api/v1/edoctas/:id
// @access    Private/Admin
exports.deleteBaja = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    deleted: true,
    deletedDate: Date.now(),
  };

  let baja = await Bajas.findById(req.params.id);

  if (!baja) {
    return next(
      new ErrorResponse(
        `baja not found with the id of ${req.params.id}`,
        404
      )
    );
  }
  // Make sure user is owner
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.params.id} is not authorized to delete this Bajas`,
        401
      )
    );
  }

  baja = await Bajas.findByIdAndUpdate(
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
