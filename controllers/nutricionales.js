const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const fs = require('fs');
const Nutricionals = require('../models/Nutricional');

// @desc      Get all nutricionals
// @route     GET /api/v1/nutricionals
// @access    Private/Admin
exports.getNutricionales = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
  });
  
  // @desc      Get single nutricional
  // @route     GET /api/v1/nutricionals/:id
  // @access    Private/Admin
  exports.getNutricional = asyncHandler(async (req, res, next) => {
    const nutricional = await Nutricionals.findById(req.params.id);
  
    if (!nutricional) {
      return next(
        new ErrorResponse(`Nutricional not found with the id of ${req.params.id}`, 404)
      );
    }
  
    res.status(200).json({
      success: true,
      data: nutricional,
    });
  });
  


// @desc      Create nutricionals
// @route     POST /api/v1/horses
// @access    Private/Admin
exports.addNutricional = asyncHandler(async (req, res, next) => {
  let nutricional = await Nutricionals.findById(req.params.horses);

if (!nutricional) {
nutricional = await Nutricionals.create(req.body);

} else {
let arreglo = req.body.Nutri
nutricional.Nutri.push(arreglo[0])
nutricional.save({ validateBeforeSave: false })

}


  res.status(201).json({
    success: true,
    data: nutricional,
  });
});



// @desc      Update nutricional
// @route     POST /api/v1/horses
// @access    Private/Admin
exports.updateNutricional = asyncHandler(async (req, res, next) => {
let nutricional = await Nutricionals.findById(req.params.horses);

if (nutricional) {
let id = req.body.Nutri[0]._id


let doc = nutricional.Nutri.id(id)
doc.fecha = req.body.Nutri[0].fecha
doc.comentario = req.body.Nutri[0].comentario
doc.monto = req.body.Nutri[0].monto
nutricional.save({ validateBeforeSave: false })

}

res.status(201).json({
  success: true,
  data: nutricional,
});
});


// @desc      delete nutricional
// @route     POST /api/v1/horses
// @access    Private/Admin
exports.deleteNutricional = asyncHandler(async (req, res, next) => {
let nutricional = await Nutricionals.findById(req.params.horses);

if (nutricional) {
let id = req.body._id

nutricional.Nutri.id(id).remove()

nutricional.save({ validateBeforeSave: false })

}

res.status(201).json({
  success: true,
  data: {},
});
});