const express = require('express');

const {
  getBajas,
  createBaja,
  getBaja,
  updateBaja,
  deleteBaja,
} = require('../controllers/bajas');

const Bajas = require('../models/Baja');

const bajaRouter = require('./cuerpoBajas');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');

const { protect, authorize } = require('../middleware/auth');

router.use('/:bajaId/cuerpo', bajaRouter);

router.use(protect);
router.use(authorize('publisher', 'admin'));

router
  .route('/')
  .get(advancedResults(Bajas), getBajas)
  .post(createBaja);

router
  .route('/:id')
  .get(getBaja)
  .put(updateBaja)
  .delete(deleteBaja);

module.exports = router;
