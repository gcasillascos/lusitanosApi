const express = require('express');
const {
  getOwners,
  getOwner,
  createOwner,
  updateOwner,
  deleteOwner,
  ownerPhotoUpload,
  ownerPhotoUpload2,
  ownerPhotoRetrive,
  ownerMultiplePhotoUpload,
  ownerCountries,
} = require('../controllers/owners');


// const {
//   createPreRegistro,

// } = require('../controllers/preRegistros');

const Owners = require('../models/Owner');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');

// Include other resource routers
const horseRouter = require('./horses');

// const preRegRouter = require('./preRegistros');
// const valoracionRouter = require('./valoraciones');

const { protect, authorize } = require('../middleware/auth');

//router.use(protect);

// Re-route into other resource routers
router.use('/:ownerId/horses', horseRouter);


router
  .route('/')
  // .get(advancedResults(Owners, 'horses'),  getOwners)
  .get(advancedResults(Owners),  getOwners)
  .post(authorize('publisher', 'admin'), protect, createOwner);

router
  .route('/:id')
  .get( getOwner);
  // .put(authorize('publisher', 'admin'), protect, updateOwner)
  // .delete(authorize('publisher', 'admin'), protect, deleteOwner);

router
  .route('/photo/:id')
  .put(protect, authorize('publisher', 'admin'), ownerPhotoUpload);

router
  .route('/imagen/:id')
  .put(protect, authorize('publisher', 'admin'), ownerPhotoUpload2)
  .get(protect, authorize('publisher', 'admin'), ownerPhotoRetrive);

router
  .route('/mimages/:id')
  .put(protect, authorize('publisher', 'admin'), ownerMultiplePhotoUpload);

router
  .route('/countries/:id')
  .get(protect, authorize('publisher', 'admin'), ownerCountries);

module.exports = router;
