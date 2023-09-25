const express = require('express');

const {
  getCubriciones,
  createCubricion,
  getCubricion,
  updateCubricion,
  deleteCubricion,
} = require('../controllers/cubriciones');

const Cubriciones = require('../models/Cubricion');

const cuerpoRouter = require('./cuerpoCubricion');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');

const { protect, authorize } = require('../middleware/auth');

router.use('/:cubricionId/cuerpo', cuerpoRouter);

router.use(protect);
router.use(authorize('publisher', 'admin'));

router
  .route('/')
  .get(advancedResults(Cubriciones), getCubriciones)
  .post(createCubricion);

router
  .route('/:id')
  .get(getCubricion)
  .put(updateCubricion)
  .delete(deleteCubricion);

module.exports = router;
