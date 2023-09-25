const express = require('express');
const {
  getConceptos,
  getConcepto,
  createConcepto,
  updateConcepto,
  deleteConcepto,
} = require('../controllers/conceptos');

const Conceptos = require('../models/Concepto');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('publisher','admin'));

router
  .route('/')
  .get(advancedResults(Conceptos), getConceptos)
  .post(createConcepto);

router
  .route('/:id')
  .get(getConcepto)
  .put(updateConcepto)
  .delete(deleteConcepto);

module.exports = router;
