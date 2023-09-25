const express = require('express');

const {
  getPreRegistros,
  createPreRegistro,
  getPreRegistro,
  updatePreRegistro,
  deletePreRegistro,
} = require('../controllers/preRegistros');

const PreRegistros = require('../models/formatos/PreRegistro');

// const cuerpoRouter = require('./cuerpoPreRegistro');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');

const { protect, authorize } = require('../middleware/auth');

// router.use('/:preRegistroId/cuerpo', cuerpoRouter);

router.use(protect);
router.use(authorize('publisher', 'admin'));

router
  .route('/')
  .get(advancedResults(PreRegistros), getPreRegistros)
   .post(createPreRegistro)

 router
   .route('/:id')
  .get(getPreRegistro)
   .put(updatePreRegistro)
   .delete(deletePreRegistro)



module.exports = router;
