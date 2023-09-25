const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Conceptos = require('../models/Concepto');
const Cuentas = require('../models/Cuenta');
// @desc      Get all Concepto
// @route     GET /api/v1/Concepto
// @access    Private/Admin
exports.getConceptos = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single Concepto
// @route     GET /api/v1/Concepto/:id
// @access    Private/Admin
exports.getConcepto = asyncHandler(async (req, res, next) => {
  const concepto = await Conceptos.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: concepto,
  });
});

// @desc      Create concepto
// @route     POST /api/v1/Concepto
// @access    Private/Admin
exports.createConcepto = asyncHandler(async (req, res, next) => {
  let cuenta = await Cuentas.findById(req.params.cuentaId);

  if (!cuenta) {
    return next(
      new ErrorResponse(`Cuenta not found with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is owner
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.params.id} is not authorized to create this Cuenta`,
        401
      )
    );
  }

  const id = req.params.cuentaId;

  req.body.cuenta = id;
  const concepto = await Conceptos.create(req.body);

  res.status(201).json({
    success: true,
    data: concepto,
  });
});

// @desc      Update concepto
// @route     PUT /api/v1/Concepto/:id
// @access    Private/Admin
exports.updateConcepto = asyncHandler(async (req, res, next) => {
  let concepto = await Conceptos.findById(req.params.id);

  if (!concepto) {
    return next(
      new ErrorResponse(
        `Concepto not found with the id of ${req.params.id}`,
        404
      )
    );
  }
  // Make sure user is owner
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.params.id} is not authorized to delete this Concepto`,
        401
      )
    );
  }
  concepto = await Conceptos.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: concepto,
  });
});

// @desc      Delete concepto
// @route     DELETE /api/v1/Concepto/:id
// @access    Private/Admin
exports.deleteConcepto = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    deleted: true,
    deletedDate: Date.now(),
  };

  let concepto = await Conceptos.findById(req.params.id);

  if (!concepto) {
    return next(
      new ErrorResponse(
        `concepto not found with the id of ${req.params.id}`,
        404
      )
    );
  }
  // Make sure user is owner
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.params.id} is not authorized to delete this Concepto`,
        401
      )
    );
  }

  concepto = await Conceptos.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  // await Owners.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});
