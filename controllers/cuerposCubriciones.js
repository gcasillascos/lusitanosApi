const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const cuerpoCubs = require('../models/CuerpoCubricion');
const Cubricion = require('../models/Cubricion');
// @desc      Get all cuerpo
// @route     GET /api/v1/cuerpo
// @access    Private/Admin
exports.getCuerposCubs = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single cuerpo
// @route     GET /api/v1/cuerpo/:id
// @access    Private/Admin
exports.getCuerposCub = asyncHandler(async (req, res, next) => {
  const cuerpo = await cuerpoCubs.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: cuerpo,
  });
});

// @desc      Create cuerpo
// @route     POST /api/v1/cuerpo
// @access    Private/Admin
exports.createCuerposCub = asyncHandler(async (req, res, next) => {
  let edocta = await EdoCtas.findById(req.params.edoctaId);

  if (!edocta) {
    return next(
      new ErrorResponse(
        `Cubrición is not found with the id of ${req.params.edoctaId}`,
        404
      )
    );
  }

  // Make sure user is owner
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.params.edoctaId} is not authorized to create this Cubrición`,
        401
      )
    );
  }

  const id = req.params.edoctaId;

  req.body.edocta = id;
  const cuerpo = await cuerpoCubs.create(req.body);

  res.status(201).json({
    success: true,
    data: cuerpo,
  });
});

// @desc      Update cuerpo
// @route     PUT /api/v1/cuerpo/:id
// @access    Private/Admin
exports.updateCuerposCub = asyncHandler(async (req, res, next) => {
  let cuerpo = await cuerpoCubs.findById(req.params.id);

  if (!cuerpo) {
    return next(
      new ErrorResponse(`cuerpo not found with the id of ${req.params.id}`, 404)
    );
  }
  // Make sure user is owner
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.params.id} is not authorized to delete this cuerpo`,
        401
      )
    );
  }
  cuerpo = await cuerpoCubs.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: cuerpo,
  });
});

// @desc      Delete cuerpo
// @route     DELETE /api/v1/cuerpo/:id
// @access    Private/Admin
exports.deleteCuerposCub = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    deleted: true,
    deletedDate: Date.now(),
  };

  let cuerpo = await cuerpoCubs.findById(req.params.id);

  if (!cuerpo) {
    return next(
      new ErrorResponse(`cuerpo not found with the id of ${req.params.id}`, 404)
    );
  }
  // Make sure user is owner
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.params.id} is not authorized to delete this cuerpo`,
        401
      )
    );
  }

  cuerpo = await cuerpoCubs.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  // await Owners.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});
