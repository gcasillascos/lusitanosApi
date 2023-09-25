const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const PreRegistros = require('../models/formatos/PreRegistro');


// @desc      Get all PreRegistro
// @route     GET /api/v1/edoctas
// @access    Private/Admin
exports.getPreRegistros = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single PreRegistro
// @route     GET /api/v1/edoctas/:id
// @access    Private/Admin
exports.getPreRegistro = asyncHandler(async (req, res, next) => {
  const preRegistro = await PreRegistros.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: preRegistro,
  });
});

// @desc      Create preRegistro
// @route     POST /api/v1/owners/:Id/prereg
// @access    Private/Admin
exports.createPreRegistro = asyncHandler(async (req, res, next) => {
    const preRegistro = await PreRegistros.create(req.body);
  
    res.status(201).json({
      success: true,
      data: preRegistro,
    });
  });
  
  // @desc      Update cubricion
// @route     PUT /api/v1/owners/:Id/prereg
// @access    Private/Admin
exports.updatePreRegistro = asyncHandler(async (req, res, next) => {
  let preRegistro = await PreRegistros.findById(req.params.id);

  if (!preRegistro) {
    return next(
      new ErrorResponse(
        `PreRegistro not found with the id of ${req.params.id}`,
        404
      )
    );
  }
  // Make sure user is owner
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.params.id} is not authorized to delete this PreRegistro`,
        401
      )
    );
  }

  preRegistro = await PreRegistros.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: preRegistro,
  });
});


// @desc      Delete cubricion
// @route     DELETE /api/v1/edoctas/:id
// @access    Private/Admin
exports.deletePreRegistro = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    deleted: true,
    deletedDate: Date.now(),
  };

  let preRegistro = await PreRegistros.findById(req.params.id);

  if (!preRegistro) {
    return next(
      new ErrorResponse(
        `PreRegistro not found with the id of ${req.params.id}`,
        404
      )
    );
  }
  // Make sure user is owner
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.params.id} is not authorized to delete this PreRegistro`,
        401
      )
    );
  }

  preRegistro = await PreRegistros.findByIdAndUpdate(
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