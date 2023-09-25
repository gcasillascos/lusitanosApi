const express = require('express');
const {
  getPremios,
  getPremioById,
  addPremio,
  updatePremio,
  deletePremio,
} = require('../controllers/premios');

const Premios = require('../models/Premio');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');

const { protect, authorize } = require('../middleware/auth');



router
  .route('/')
  // .get(advancedResults(Premios), protect, authorize('admin'), getPremios)
  .get(advancedResults(Premios), getPremios)
//  .post(protect, authorize('publisher', 'admin'), addPremio);

router
  .route('/:id')
//  .get(getPremioById)
//  .put(protect, authorize('publisher', 'admin'), updatePremio)
 // .delete(protect, authorize('publisher', 'admin'), deletePremio);


module.exports = router;
