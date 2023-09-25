const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const fs = require('fs');
const Sanitarios = require('../models/Sanitario');

// @desc      Get all sanitarios
// @route     GET /api/v1/sanitarios
// @access    Private/Admin
exports.getSanitarios = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
  });
  
  // @desc      Get single sanitario
  // @route     GET /api/v1/sanitarios/:id
  // @access    Private/Admin
  exports.getSanitario = asyncHandler(async (req, res, next) => {
    const sanitario = await Owners.findById(req.params.id);
  
    if (!sanitario) {
      return next(
        new ErrorResponse(`Sanitario not found with the id of ${req.params.id}`, 404)
      );
    }
  
    res.status(200).json({
      success: true,
      data: sanitario,
    });
  });
  

// @desc      Create sanitarios
// @route     POST /api/v1/horses
// @access    Private/Admin
exports.addSanitario = asyncHandler(async (req, res, next) => {
    let sanitario = await Sanitarios.findById(req.params.horses);
  
 if (!sanitario) {
  sanitario = await Sanitarios.create(req.body);

 } else {
  let arreglo = req.body.Sanit
  sanitario.Sanit.push(arreglo[0])
  sanitario.save({ validateBeforeSave: false })

 }


    res.status(201).json({
      success: true,
      data: sanitario,
    });
  });



  // @desc      Update sanitario
// @route     POST /api/v1/horses
// @access    Private/Admin
exports.updateSanitario = asyncHandler(async (req, res, next) => {
  let sanitario = await Sanitarios.findById(req.params.horses);

if (sanitario) {
  let id = req.body.Sanit[0]._id


  let doc = sanitario.Sanit.id(id)
  doc.fecha = req.body.Sanit[0].fecha
  doc.comentario = req.body.Sanit[0].comentario
  doc.monto = req.body.Sanit[0].monto
  sanitario.save({ validateBeforeSave: false })

}

  res.status(201).json({
    success: true,
    data: sanitario,
  });
});


  // @desc      Update sanitario
// @route     POST /api/v1/horses
// @access    Private/Admin
exports.deleteSanitario = asyncHandler(async (req, res, next) => {
  let sanitario = await Sanitarios.findById(req.params.horses);

if (sanitario) {
  let id = req.body._id

  sanitario.Sanit.id(id).remove()

  sanitario.save({ validateBeforeSave: false })

}

  res.status(201).json({
    success: true,
    data: {},
  });
});