const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const fs = require('fs');
const awsS3 = require('../utils/awsS3');
const Owners = require('../models/Owner');

// @desc      Get all owners
// @route     GET /api/v1/owners
// @access    Private/Admin
exports.getOwners = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});




// @desc      Get single owner
// @route     GET /api/v1/owners/:id
// @access    Private/Admin
exports.getOwner = asyncHandler(async (req, res, next) => {
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

// @desc      Create owner
// @route     POST /api/v1/owner
// @access    Private/Admin
exports.createOwner = asyncHandler(async (req, res, next) => {
  const owner = await Owners.create(req.body);

  res.status(201).json({
    success: true,
    data: owner,
  });
});

// @desc      Update owner
// @route     PUT /api/v1/owners/:id
// @access    Private/Admin
exports.updateOwner = asyncHandler(async (req, res, next) => {
  let owner = await Owners.findById(req.params.id);

  if (!owner) {
    return next(
      new ErrorResponse(`Owner not found with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is  owner
  if (owner._id.toString() !== req.user.owner && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.params.id} is not authorized to update this bootcamp`,
        401
      )
    );
  }

  const obj = mapeoOwner(req.params.id, req.body)

  owner = await Owners.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: owner,
  });
});

// @desc      Delete owner
// @route     DELETE /api/v1/owners/:id
// @access    Private/Admin
exports.deleteOwner = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    deleted: true,
    deletedDate: Date.now(),
  };

  let owner = await Owners.findById(req.params.id);

  if (!owner) {
    return next(
      new ErrorResponse(`Owner not found with the id of ${req.params.id}`, 404)
    );
  }
  // Make sure user is owner
  if (owner._id.toString() !== req.user.owner && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.params.id} is not authorized to update this bootcamp`,
        401
      )
    );
  }

  owner = await Owners.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  // await Owners.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Upload photo for owner filesystem
// @route   PUT /api/v1/owner/photo/:id
// @access  Private
exports.ownerPhotoUpload = asyncHandler(async (req, res, next) => {
  const owner = await Owners.findById(req.params.id);

  if (!owner) {
    return next(
      new ErrorResponse(`Owner not found with id of ${req.params.id}`, 404)
    );
  }

  //Make sure user is owner
  if (owner._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.user.id} is not authorized to update this owner`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const file = req.files.file;

  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Please upload an image file', 400));
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image Less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  console.log(__dirname);
  console.log(
    path.join(
      __dirname,
      `${process.env.FILE_UPLOAD_PATH_HIERROS}`,
      `${file.name}`
    )
  );
  //create custom filename
  file.name = `${owner.id}${path.parse(file.name).ext}`;
  file.mv(
    path.join(
      __dirname,
      `${process.env.FILE_UPLOAD_PATH_HIERROS}`,
      `${file.name}`
    ),
    async (err) => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse('Problem with file upload', 500));
      }

      // await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name});

      res.status(200).json({
        success: true,
        data: file.name,
      });
    }
  );
});

// @desc    Upload photo for owner AWS
// @route   PUT /api/v1/owner/photo/:id
// @access  Private
exports.ownerPhotoUpload2 = asyncHandler(async (req, res, next) => {
  const owner = await Owners.findById(req.params.id);

  if (!owner) {
    return next(
      new ErrorResponse(`Owner not found with id of ${req.params.id}`, 404)
    );
  }

  //Make sure user is owner
  if (owner._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.user.id} is not authorized to update this owner`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const files = req.files.file;
  let upload;

  const archs = [];

  if (files.length === undefined) {
    archs.push(files);
  } else {
    for (let file of files) {
      archs.push(file);
    }
  }

  for (let file of archs) {
    console.log(file);

    if (!file.mimetype.startsWith('image')) {
      return next(new ErrorResponse('Please upload an image file', 400));
    }

    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `Please upload image ${file.name}, with a size less than ${process.env.MAX_FILE_UPLOAD}`,
          400
        )
      );
    }

    //create custom filename
    fileName = `${owner.id}_${Date.now()}${path.parse(file.name).ext}`;

    upload = await awsS3.uploadData({
      fileName,
      file,
      ruta: ruta.HIERROS,
    });
  }

  res.status(200).json({
    success: true,
    data: fileName,
    upload,
  });
});

// @desc    Upload multiple photos for owner
// @route   PUT /api/v1/owner/mphoto/:id
// @access  Private
exports.ownerMultiplePhotoUpload = asyncHandler(async (req, res, next) => {
  const owner = await Owners.findById(req.params.id);

  if (!owner) {
    return next(
      new ErrorResponse(`Owner not found with id of ${req.params.id}`, 404)
    );
  }

  //Make sure user is owner
  if (owner._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.user.id} is not authorized to update this owner`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const file = req.files.file;

  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Please upload an image file', 400));
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image Less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  //create custom filename
  fileName = `${owner.id}${path.parse(file.name).ext}`;

  const upload = await awsS3.uploadImage({
    fileName,
    file,
    ruta: ruta.HIERROS,
  });

  res.status(200).json({
    success: true,
    data: fileName,
    upload,
  });
});

// @desc    Retrive photo for owner
// @route   GET /api/v1/owner/photo/:id
// @access  Private
exports.ownerPhotoRetrive = asyncHandler(async (req, res, next) => {
  const owner = await Owners.findById(req.params.id);

  if (!owner) {
    return next(
      new ErrorResponse(`Owner not found with id of ${req.params.id}`, 404)
    );
  }

  //Make sure user is owner
  if (owner._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.user.id} is not authorized to update this owner`,
        401
      )
    );
  }

  let list = await awsS3.listData({
    ruta: ruta.HIERROS,
  });

  //create custom filename
  //fileName = `${owner.id}${path.parse(file.name).ext}`;
  fileName = `${owner.id}.png`;

  const upload = await awsS3.downloadData({
    fileName,
    ruta: ruta.HIERROS,
  });

  res.status(200).json({
    success: true,
    data: fileName,
    upload,
  });
});

exports.ownerCountries = asyncHandler(async (req, res, next) => {
  const countries = await Owners.find().distinct('country')

  if (!countries) {
    return next(
      new ErrorResponse(`Countries are not found `, 404)
    )
  }


  res.status(200).json({
    success: true,
    data: countries,
  })
})

function mapeoOwner(id, datos){

  return  {
    _id: id,
    lastName: datos.lastNameT,
    firstName: datos.firstNameT,
    salutation: datos.salutationT,
    farm: datos.farm,
    street: datos.street,
    city: datos.city,
    state: datos.state,
    country: datos.country,
    postalCode: datos.postalCode,
    phone: datos.phone,
    memberDate: datos.memberDate,
    rfc: datos.rfc,
    website: datos.website,
    email: datos.email,
    "titular": [
      {
          "chk": datos.chkT,
          "street": datos.streetT,
          "city": datos.cityT,
          "state": datos.stateT,
          "country": datos.countryT,
          "postalCode": datos.postalCodeT,
          "phone": datos.phoneT,
          "email": datos.emailT,
      }
  ],
  "contacto": [
      { 
        "chk": datos.chkC,   
        "lastName": datos.lastNameC,
        "firstName": datos.firstNameC,
        "salutation": datos.salutationC,
        "street": datos.streetC,
        "city": datos.cityC,
        "state": datos.stateC,
        "country": datos.countryC,
        "postalCode": datos.postalCodeC,
        "phone": datos.phoneC,
        "email": datos.emailC,
      }
  ],
  "representante": [
      {
        "chk": datos.chkR,
        "lastName": datos.lastNameR,
        "firstName": datos.firstNameR,
        "salutation": datos.salutationR,
        "street": datos.streetR,
        "city": datos.cityR,
        "state": datos.stateR,
        "country": datos.countryR,
        "postalCode": datos.postalCodeR,
        "phone": datos.phoneR,
        "email": datos.emailR,
      }]
  };
}