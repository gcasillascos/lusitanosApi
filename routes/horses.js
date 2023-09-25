const express = require('express');
const {
  getHorses,
  getHorseById,
  getHorseByName,
  addHorse,
  updateHorse,
  deleteHorse,
} = require('../controllers/horses');

const Horses = require('../models/Horse');

const router = express.Router({ mergeParams: true });
const cubricionRouter = require('./cubriciones');
const advancedResults = require('../middleware/advancedResults');

const pedRouter = require('./pedigrees')
const premRouter = require('./premios')
const nutriRouter = require('./nutricionales')
const sanitRouter = require('./sanitarios')
const valorRouter = require('./valoraciones')

const { protect, authorize } = require('../middleware/auth');

router.use('/:horses/pedigrees', pedRouter);
router.use('/:horses/cubriciones', cubricionRouter);
router.use('/:horses/premios', premRouter);
router.use('/:horses/nutricional', nutriRouter);
router.use('/:horses/sanitario', sanitRouter);
router.use('/:horses/valoracion', valorRouter);
// router.use('/:horse/prereg', preRouter);
// router.use('/:horse/valoraciones', valoracionRouter);

router
  .route('/')
  .get(advancedResults(Horses, 'pedigree', 'owner', 'breeder', 'brand'), protect, authorize('publisher','admin'), getHorses)
  .post(protect, authorize('publisher', 'admin'), addHorse);

router
  .route('/:id')
  .get(getHorseById)
  .put(protect, authorize('publisher', 'admin'), updateHorse)
  .delete(protect, authorize('publisher', 'admin'), deleteHorse);

router
  .route('/name/:name')
  .get(protect, authorize('publisher', 'admin'), getHorseByName);



/* .put(authorize('publisher','admin'),updateOwner)
  .delete(authorize('admin'), deleteOwner);

router
.route('/photo/:id').put(protect, authorize('publisher', 'admin'), ownerPhotoUpload); */

module.exports = router;
