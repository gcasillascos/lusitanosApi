const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Horses = require('../models/Horse');
const Owners = require('../models/Owner');
const Pedigrees = require('../models/Pedigree');

// @desc      Get all horses
// @route     GET /api/v1/horses
// @access    Private/Admin
exports.getHorses = asyncHandler(async (req, res, next) => {
  if (req.params.ownerId) {
    const horses = await Horses.find({ ownerId: req.params.ownerId });
    return res.status(200).json({
      success: true,
      count: horses.length,
      data: horses,
    });
  } else {
    res.status(200).json( res.advancedResults);
  }
});

// @desc      Get single horse by Id
// @route     GET /api/v1/horses/:id
// @access    Private/Admin, publisher
exports.getHorseById = asyncHandler(async (req, res, next) => {
  const horse = await Horses.findById(req.params.id)
  .populate({ path: 'pedigree', populate: {path:'abuelo', populate:{path: 'abueloDat'}}})
  .populate({ path: 'pedigree', populate: {path:'abuela', populate:{path: 'abuelaDat'}}})
  .populate('owner')
  .populate('breeder')
  .populate('brand')
  .populate('prem')
  .populate('sanitario')
  .populate('nutricion')
  .populate('nacimiento')
  .populate('valoracion')
  .populate({path:'cubricion', populate: {path:'horseData'}})
  

  if (!horse) {
    return next(
      new ErrorResponse(`Horse not found with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: horse,
  });
});

// @desc      Get horses by Name
// @route     GET /api/v1/horses/name/:name
// @access    Private/Admin, publisher
exports.getHorseByName = asyncHandler(async (req, res, next) => {

  const expresion = new RegExp(req.params.name)
  const horse = await Horses.find({horseName: {$in: [expresion]}});

   if (!horse) {
    return next(
      new ErrorResponse(
        `Horse not found with the name of ${req.params.name}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: horse,
  });
});



// @desc    Adding a Horse
// @route   POST /api/v1/owners/:ownerId/horses
// @access  Private
exports.addHorse = asyncHandler(async (req, res, next) => {
  const cadena = '000000';
  req.body.ownerId = req.params.ownerId;
  req.body.user = req.user.owner;

  const owner = await Owners.findById(req.params.ownerId);

  if (!owner) {
    return next(
      new ErrorResponse(`No owner with the id of ${req.params.ownerId}`, 404)
    );
  }

  //Make sure user is owner
  if (owner._id.toString() !== req.user.owner && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.user.id} is not authorized to add a horse to owner ${owner.id}`,
        401
      )
    );
  }

  //create recNum

  const numero = await Horses.find({}, { recNum: 1 })
    .sort({ recNum: -1 })
    .limit(1);

  if (!numero) {
    return next(new ErrorResponse(`Horse not found with the name of `, 404));
  }

  req.body.recNum = parseInt(numero[0].recNum) + 1;
  let id = cadena + req.body.recNum;
  req.body._id = id.substring(id.length - 6);

  //   next();

  const horse = await Horses.create(req.body);

  res.status(200).json({
    success: true,
    data: horse,
  });
});

// @desc      Update horse
// @route     PUT /api/v1/horses/:id
// @access    Private/Admin
exports.updateHorse = asyncHandler(async (req, res, next) => {
  let horse = await Horses.findById(req.params.id);

  if (!horse) {
    return next(
      new ErrorResponse(`Horse not found with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is owner
  if (
    horse.ownerId.toString() !== req.user.owner &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `user ${req.params.id} is not authorized to update this horse`,
        401
      )
    );
  }

  horse = await Horses.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: horse,
  });
});

// @desc      Delete horse
// @route     DELETE /api/v1/horses/:id
// @access    Private/Admin
exports.deleteHorse = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    deleted: true,
    deletedDate: Date.now(),
  };

  // Make sure user is bootcamp owner
  if (
    horse.ownerId.toString() !== req.user.owner &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `user ${req.params.id} is not authorized to delete this horse`,
        401
      )
    );
  }
  const horse = await Horses.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});



