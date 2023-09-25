const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Cuerpos = require('../models/CuerpoEdoCta');
const EdoCtas = require('../models/EdoCta');
// @desc      Get all cuerpo
// @route     GET /api/v1/cuerpo
// @access    Private/Admin
exports.getCuerpos = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single cuerpo
// @route     GET /api/v1/cuerpo/:id
// @access    Private/Admin
exports.getCuerpo = asyncHandler(async (req, res, next) => {
  const cuerpo = await Cuerpos.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: cuerpo,
  });
});

// @desc      Create cuerpo
// @route     POST /api/v1/cuerpo
// @access    Private/Admin
exports.createCuerpo = asyncHandler(async (req, res, next) => {
  let edocta = await EdoCtas.findById(req.params.edoctaId);

  if (!edocta) {
    return next(
      new ErrorResponse(
        `Edocta not found with the id of ${req.params.edoctaId}`,
        404
      )
    );
  }

  // Make sure user is owner
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.params.edoctaId} is not authorized to create this edocta`,
        401
      )
    );
  }

  const id = req.params.edoctaId;

  req.body.edocta = id;
  const cuerpo = await Cuerpos.create(req.body);

  res.status(201).json({
    success: true,
    data: cuerpo,
  });
});

// @desc      Update cuerpo
// @route     PUT /api/v1/cuerpo/:id
// @access    Private/Admin
exports.updateCuerpo = asyncHandler(async (req, res, next) => {
  let cuerpo = await Cuerpos.findById(req.params.id);

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
  cuerpo = await Cuerpos.findByIdAndUpdate(req.params.id, req.body, {
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
exports.deleteCuerpo = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    deleted: true,
    deletedDate: Date.now(),
  };

  let cuerpo = await Cuerpos.findById(req.params.id);

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

  cuerpo = await Cuerpos.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  // await Owners.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});
