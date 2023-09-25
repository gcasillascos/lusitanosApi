const express = require('express');

const {
  getValoraciones,
  createValoracion,
  getValoracion,
  updateValoracion,
  deleteValoracion,
} = require('../controllers/valoraciones');

const Valoraciones = require('../models/formatos/Valoracion');

// const cuerpoRouter = require('./cuerpoValoracion');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');

const { protect, authorize } = require('../middleware/auth');

// router.use('/:preRegistroId/cuerpo', cuerpoRouter);

router.use(protect);
router.use(authorize('publisher', 'admin'));

router
  .route('/')
  .get(advancedResults(Valoraciones), getValoraciones)
   .post(createValoracion)

 router
   .route('/:id')
  .get(getValoracion)
   .put(updateValoracion)
   .delete(deleteValoracion)



module.exports = router;
