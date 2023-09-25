const express = require('express');
const {
  getSanitarios,
  getSanitario,
  addSanitario,
  updateSanitario,
  deleteSanitario,
} = require('../controllers/sanitarios');

const Sanitarios = require('../models/Sanitario');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');


const { protect, authorize } = require('../middleware/auth');


router
  .route('/')
  .get(advancedResults(Sanitarios), protect, authorize('admin'), getSanitarios)
  .post(protect, authorize('publisher', 'admin'), addSanitario)
  .put(protect, authorize('publisher', 'admin'), updateSanitario)
  .delete(protect, authorize('publisher', 'admin'), deleteSanitario);
router
  .route('/:id')
//  .get(getSanitarioById)
//  .put(protect, authorize('publisher', 'admin'), updateSanitario)
 // .delete(protect, authorize('publisher', 'admin'), deleteSanitario);


module.exports = router;
