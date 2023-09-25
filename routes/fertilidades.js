const express = require('express');

const {
  getFertilidades,
  createFertilidad,
  getFertilidad,
  updateFertilidad,
  deleteFertilidad,
} = require('../controllers/fertilidades');

const Fertilidades = require('../models/formatos/fertilidad');

// const cuerpoRouter = require('./cuerpoFertilidad');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');

const { protect, authorize } = require('../middleware/auth');

// router.use('/:preRegistroId/cuerpo', cuerpoRouter);

router.use(protect);
router.use(authorize('publisher', 'admin'));

router
  .route('/')
  .get(advancedResults(Fertilidades), getFertilidades)
   .post(createFertilidad)

 router
   .route('/:id')
  .get(getFertilidad)
   .put(updateFertilidad)
   .delete(deleteFertilidad)



module.exports = router;
