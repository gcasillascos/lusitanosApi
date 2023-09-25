const express = require('express');
const {
  getNutricionales,
  getNutricionalById,
  addNutricional,
  updateNutricional,
  deleteNutricional,
} = require('../controllers/nutricionales');

const Nutricionales = require('../models/Nutricional');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');



const { protect, authorize } = require('../middleware/auth');



router
  .route('/')
  .get(advancedResults(Nutricionales), protect, authorize('admin'), getNutricionales)
  .post(protect, authorize('publisher', 'admin'), addNutricional)
  .put(protect, authorize('publisher', 'admin'), updateNutricional)
  .delete(protect, authorize('publisher', 'admin'), deleteNutricional);

router
  .route('/:id')
//  .get(getNutricionalById)
//  .put(protect, authorize('publisher', 'admin'), updateNutricional)
 // .delete(protect, authorize('publisher', 'admin'), deleteNutricional);


module.exports = router;
