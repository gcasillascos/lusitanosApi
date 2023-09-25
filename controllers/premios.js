const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const fs = require('fs');
const Premios = require('../models/Premio');

// @desc      Get all premios
// @route     GET /api/v1/premios
// @access    Private/Admin
exports.getPremios = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
  });
  
  // @desc      Get single premio
  // @route     GET /api/v1/premios/:id
  // @access    Private/Admin
  exports.getPremio = asyncHandler(async (req, res, next) => {
    const owner = await Owners.findById(req.params.id);
  
    if (!owner) {
      return next(
        new ErrorResponse(`Owner not found with the id of ${req.params.id}`, 404)
      );
    }
  
    res.status(200).json({
      success: true,
      data: owner,
    });
  });
  

// @desc      Create premios
// @route     POST /api/v1/horses
// @access    Private/Admin
exports.addPremio = asyncHandler(async (req, res, next) => {
  let premio = await Premios.findById(req.params.horses);

if (!premio) {
premio = await Premios.create(req.body);

} else {
let arreglo = req.body.Premios
premio.Premios.push(arreglo[0])
premio.save({ validateBeforeSave: false })

}


  res.status(201).json({
    success: true,
    data: premio,
  });
});



// @desc      Update premio
// @route     POST /api/v1/horses
// @access    Private/Admin
exports.updatePremio = asyncHandler(async (req, res, next) => {
let premio = await Premios.findById(req.params.horses);

if (premio) {
let id = req.body.Premios[0]._id


let doc = premio.Premios.id(id)
doc.fecha = req.body.Premios[0].fecha
doc.comentario = req.body.Premios[0].comentario
doc.monto = req.body.Premios[0].monto
premio.save({ validateBeforeSave: false })

}

res.status(201).json({
  success: true,
  data: premio,
});
});


// @desc      Update premio
// @route     POST /api/v1/horses
// @access    Private/Admin
exports.deletePremio = asyncHandler(async (req, res, next) => {
let premio = await Premios.findById(req.params.horses);

if (premio) {
let id = req.body._id

premio.Premios.id(id).remove()

premio.save({ validateBeforeSave: false })

}

res.status(201).json({
  success: true,
  data: {},
});
});