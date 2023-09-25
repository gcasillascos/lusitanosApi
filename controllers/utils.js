const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const qrCode = require('../utils/qrCode');
const { encrypt, decrypt } = require('../utils/crypto');
const images = require('../utils/images');
const Horses = require('../models/Horse')

// @desc      Get images
// @route     GET /api/v1/utils/imag
// @access    Private/Admin
exports.getImages = asyncHandler(async (req, res, next) => {
  const codigo = await images({
    id: req.body._id,
    ruta: req.body.ruta,
    tipo: req.body.tipo,
    horseId: req.body.horseId
  });

  res.status(200).json({
    success: true,
    data: codigo,
  });
});

// @desc      Get qrCode
// @route     GET /api/v1/utils/qrcode
// @access    Private/Admin
exports.getQrcode = asyncHandler(async (req, res, next) => {
  const codigo = await qrCode({
    name: req.body.nombre,
    color: req.body.color,
  });

  res.status(200).json({
    success: true,
    data: codigo,
  });
});

// @desc      Encrypt
// @route     GET /api/v1/utils/encrypt
// @access    Private/Admin
exports.getEncrypt = asyncHandler(async (req, res, next) => {
  const dato = await encrypt({
    message: req.body.message,
  });

  res.status(200).json({
    success: true,
    data: dato,
  });
});

// @desc      Decrypt
// @route     GET /api/v1/utils/decrypt
// @access    Private/Admin
exports.getDecrypt = asyncHandler(async (req, res, next) => {
  const dato = await decrypt({
    message: req.body.message,
  });

  res.status(200).json({
    success: true,
    data: dato,
  });
});


// @desc      Next horse
// @route     GET /api/v1/util/nexthorse
// @access    Private/Admin
exports.getNextHorse = asyncHandler(async (req, res, next) => {
  

  const horse = await Horses.find({}, {recNum: 1, _id: 0}).sort({_id
    :-1}).limit(1)

    horse[0].recNum =horse[0].recNum +1;
  res.status(200).json({
    success: true,
    data: horse,
  });
});


// @desc      Get Imagenes
// @route     GET /api/v1/utils/images
// @access    Private/Admin
exports.getImagesList = asyncHandler(async (req, res, next) => {
  let codigo = await images.imageList({
    id: req.body.id,
    ruta: req.body.ruta,
    tipo: req.body.tipo,
    horseId: req.body.horseId
  });

  // if (codigo.length === 0) {
  //   codigo = [
  //     "/assets/img/horse_avatar.png",
  //     "/assets/img/horse_avatar.png",
  //   ]
    // return next(
    //   new ErrorResponse(`No images where found with the id of ${req.params.id}`, 404)
    // );
  // }

  res.status(200).json({
    success: true,
    data: codigo,
  });
});