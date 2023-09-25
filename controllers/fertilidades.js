const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Fertilidades = require('../models/formatos/fertilidad');


// @desc      Get all Fertilidad
// @route     GET /api/v1/edoctas
// @access    Private/Admin
exports.getFertilidades = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single Fertilidad
// @route     GET /api/v1/edoctas/:id
// @access    Private/Admin
exports.getFertilidad = asyncHandler(async (req, res, next) => {
  const getFertilidad = await Fertilidades.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: getFertilidad,
  });
});

// @desc      Create this.getFertilidad
// @route     POST /api/v1/owners/:Id/prereg
// @access    Private/Admin
exports.createFertilidad = asyncHandler(async (req, res, next) => {
    const getFertilidad = await Fertilidades.create(req.body);
  
    res.status(201).json({
      success: true,
      data: getFertilidad,
    });
  });
  
  // @desc      Update cubricion
// @route     PUT /api/v1/owners/:Id/prereg
// @access    Private/Admin
exports.updateFertilidad = asyncHandler(async (req, res, next) => {
  let getFertilidad = await Fertilidades.findById(req.params.id);

  if (!getFertilidad) {
    return next(
      new ErrorResponse(
        `Fertilidad not found with the id of ${req.params.id}`,
        404
      )
    );
  }
  // Make sure user is owner
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.params.id} is not authorized to delete this Fertilidad`,
        401
      )
    );
  }

  getFertilidad = await Fertilidades.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: getFertilidad,
  });
});


// @desc      Delete cubricion
// @route     DELETE /api/v1/edoctas/:id
// @access    Private/Admin
exports.deleteFertilidad = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    deleted: true,
    deletedDate: Date.now(),
  };

  let getFertilidad = await Fertilidades.findById(req.params.id);

  if (!getFertilidad) {
    return next(
      new ErrorResponse(
        `Fertilidad not found with the id of ${req.params.id}`,
        404
      )
    );
  }
  // Make sure user is owner
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.params.id} is not authorized to delete this Fertilidad`,
        401
      )
    );
  }

  this.getFertilidad = await Fertilidades.findByIdAndUpdate(
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