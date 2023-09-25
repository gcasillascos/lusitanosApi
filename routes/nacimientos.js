const express = require('express');

const {
  getNacimientos,
  createNacimiento,
  getNacimiento,
  updateNacimiento,
  deleteNacimiento,
} = require('../controllers/nacimientos');

const Nacimientos = require('../models/Nacimiento');


const router = express.Router();

const advancedResults = require('../middleware/advancedResults');

const { protect, authorize } = require('../middleware/auth');

// router.use('/:cubricionId/cuerpo', cuerpoRouter);

router.use(protect);
router.use(authorize('publisher', 'admin'));


router
  .route('/')
  .get(advancedResults(Nacimientos), getNacimientos)
  .post(createNacimiento);

router
  .route('/:id')
  .get(getNacimiento)
  .put(updateNacimiento)
  .delete(deleteNacimiento);

module.exports = router;
