const express = require('express');
const {
  getCuerposBajas,
  getCuerposBaja,
  createCuerposBaja,
  updateCuerposBaja,
  deleteCuerposBaja,
} = require('../controllers/cuerposBajas');

const CuerposBajas = require('../models/CuerpoBaja');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('publisher', 'admin'));

router
  .route('/')
  .get(advancedResults(CuerposBajas), getCuerposBajas)
  .post(createCuerposBaja);

router
  .route('/:id')
  .get(getCuerposBaja)
  .put(updateCuerposBaja)
  .delete(deleteCuerposBaja);

module.exports = router;
