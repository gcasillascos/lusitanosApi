const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const EdoCtas = require('../models/EdoCta');

// @desc      Get all EdoCtas
// @route     GET /api/v1/edoctas
// @access    Private/Admin
exports.getEdoCtas = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single EdoCtas
// @route     GET /api/v1/edoctas/:id
// @access    Private/Admin
exports.getEdoCta = asyncHandler(async (req, res, next) => {
  const edoCta = await EdoCtas.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: edoCta,
  });
});

// @desc      Create edoCta
// @route     POST /api/v1/edoctas
// @access    Private/Admin
exports.createEdoCta = asyncHandler(async (req, res, next) => {
  const edoCta = await EdoCtas.create(req.body);

  res.status(201).json({
    success: true,
    data: edoCta,
  });
});

// @desc      Update edoCta
// @route     PUT /api/v1/edoctas/:id
// @access    Private/Admin
exports.updateEdoCta = asyncHandler(async (req, res, next) => {
  let edoCta = await EdoCtas.findById(req.params.id);

  if (!edoCta) {
    return next(
      new ErrorResponse(`edoCta not found with the id of ${req.params.id}`, 404)
    );
  }
  // Make sure user is owner
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.params.id} is not authorized to delete this EdoCtas`,
        401
      )
    );
  }

  edoCta = await EdoCtas.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: edoCta,
  });
});

// @desc      Delete edoCta
// @route     DELETE /api/v1/edoctas/:id
// @access    Private/Admin
exports.deleteEdoCta = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    deleted: true,
    deletedDate: Date.now(),
  };

  let edoCta = await EdoCtas.findById(req.params.id);

  if (!edoCta) {
    return next(
      new ErrorResponse(`edoCta not found with the id of ${req.params.id}`, 404)
    );
  }
  // Make sure user is owner
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.params.id} is not authorized to delete this EdoCtas`,
        401
      )
    );
  }

  edoCta = await EdoCtas.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  // await Owners.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});
