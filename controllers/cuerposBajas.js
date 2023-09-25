const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const CuerpoBajas = require('../models/CuerpoBaja');
const Baja = require('../models/Baja');
// @desc      Get all cuerpo
// @route     GET /api/v1/cuerpo
// @access    Private/Admin
exports.getCuerposBajas = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single cuerpo
// @route     GET /api/v1/cuerpo/:id
// @access    Private/Admin
exports.getCuerposBaja = asyncHandler(async (req, res, next) => {
  const cuerpo = await CuerpoBajas.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: cuerpo,
  });
});

// @desc      Create cuerpo
// @route     POST /api/v1/cuerpo
// @access    Private/Admin
exports.createCuerposBaja = asyncHandler(async (req, res, next) => {
  let cuerpo = await CuerpoBajas.findById(req.params.cuerpoId);

  if (!cuerpo) {
    return next(
      new ErrorResponse(
        `Cubrición is not found with the id of ${req.params.cuerpoId}`,
        404
      )
    );
  }

  // Make sure user is owner
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.params.cuerpoId} is not authorized to create this Cubrición`,
        401
      )
    );
  }

  const id = req.params.cuerpoId;

  req.body.cuerpoId = id;
   cuerpo = await CuerpoBajas.create(req.body);

  res.status(201).json({
    success: true,
    data: cuerpo,
  });
});

// @desc      Update cuerpo
// @route     PUT /api/v1/cuerpo/:id
// @access    Private/Admin
exports.updateCuerposBaja = asyncHandler(async (req, res, next) => {
  let cuerpo = await CuerpoBajas.findById(req.params.id);

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
  cuerpo = await CuerpoBajas.findByIdAndUpdate(req.params.id, req.body, {
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
exports.deleteCuerposBaja = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    deleted: true,
    deletedDate: Date.now(),
  };

  let cuerpo = await CuerpoBajas.findById(req.params.id);

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

  cuerpo = await CuerpoBajas.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  // await Owners.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});
