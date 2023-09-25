const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Cubriciones = require('../models/Cubricion');
const Nacimientos = require('../models/Nacimiento');

// @desc      Get all Cubriciones
// @route     GET /api/v1/edoctas
// @access    Private/Admin
exports.getCubriciones = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single Cubriciones
// @route     GET /api/v1/edoctas/:id
// @access    Private/Admin
exports.getCubricion = asyncHandler(async (req, res, next) => {
  const cubricion = await Cubriciones.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: cubricion,
  });
});

// @desc      Create cubricion
// @route     POST /api/v1/edoctas
// @access    Private/Admin
exports.createCubricion = asyncHandler(async (req, res, next) => {
  const cubricion = await Cubriciones.create(req.body);

  res.status(201).json({
    success: true,
    data: cubricion,
  });
});

// @desc      Update cubricion
// @route     PUT /api/v1/cubriciones/:id
// @access    Private/Admin
exports.updateCubricion = asyncHandler(async (req, res, next) => {
  let cubricion = await Cubriciones.findById(req.params.id);

  if (!cubricion) {
    return next(
      new ErrorResponse(
        `cubricion not found with the id of ${req.params.id}`,
        404
      )
    );
  }
  // Make sure user is owner
  // if (req.user.role !== 'admin') {
  //   return next(
  //     new ErrorResponse(
  //       `user ${req.params.id} is not authorized to delete this Cubriciones`,
  //       401
  //     )
  //   );
  // }

  cubricion = await Cubriciones.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });



  res.status(200).json({
    success: true,
    data: cubricion,
  });
});

// @desc      Delete cubricion
// @route     DELETE /api/v1/edoctas/:id
// @access    Private/Admin
exports.deleteCubricion = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    deleted: true,
    deletedDate: Date.now(),
  };

  let cubricion = await Cubriciones.findById(req.params.id);

  if (!cubricion) {
    return next(
      new ErrorResponse(
        `cubricion not found with the id of ${req.params.id}`,
        404
      )
    );
  }
  // Make sure user is owner
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.params.id} is not authorized to delete this Cubriciones`,
        401
      )
    );
  }

  cubricion = await Cubriciones.findByIdAndUpdate(
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
