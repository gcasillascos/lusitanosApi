const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Valoraciones = require('../models/Valoracion');


// @desc      Get all Valoracion
// @route     GET /api/v1/edoctas
// @access    Private/Admin
exports.getValoraciones = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single Valoracion
// @route     GET /api/v1/edoctas/:id
// @access    Private/Admin
exports.getValoracion = asyncHandler(async (req, res, next) => {
  const getValoracion = await Valoraciones.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: getValoracion,
  });
});

// @desc      Create this.getValoracion
// @route     POST /api/v1/owners/:Id/prereg
// @access    Private/Admin
exports.createValoracion = asyncHandler(async (req, res, next) => {
    const getValoracion = await Valoraciones.create(req.body);
  
    res.status(201).json({
      success: true,
      data: getValoracion,
    });
  });
  
  // @desc      Update cubricion
// @route     PUT /api/v1/owners/:Id/prereg
// @access    Private/Admin
exports.updateValoracion = asyncHandler(async (req, res, next) => {
  let getValoracion = await Valoraciones.findById(req.params.id);

  if (!getValoracion) {
    return next(
      new ErrorResponse(
        `Valoracion not found with the id of ${req.params.id}`,
        404
      )
    );
  }
  // Make sure user is owner
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.params.id} is not authorized to delete this Valoracion`,
        401
      )
    );
  }

  getValoracion = await Valoraciones.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: getValoracion,
  });
});


// @desc      Delete cubricion
// @route     DELETE /api/v1/edoctas/:id
// @access    Private/Admin
exports.deleteValoracion = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    deleted: true,
    deletedDate: Date.now(),
  };

  let getValoracion = await Valoraciones.findById(req.params.id);

  if (!getValoracion) {
    return next(
      new ErrorResponse(
        `Valoracion not found with the id of ${req.params.id}`,
        404
      )
    );
  }
  // Make sure user is owner
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.params.id} is not authorized to delete this Valoracion`,
        401
      )
    );
  }

  this.getValoracion = await Valoraciones.findByIdAndUpdate(
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