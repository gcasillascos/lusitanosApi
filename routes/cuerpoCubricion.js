const express = require('express');
const {
  getCuerposCubs,
  getCuerposCub,
  createCuerposCub,
  updateCuerposCub,
  deleteCuerposCub,
} = require('../controllers/cuerposCubriciones');

const CuerposCubs = require('../models/CuerpoCubricion');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('publisher', 'admin'));

router
  .route('/')
  .get(advancedResults(CuerposCubs), getCuerposCubs)
  .post(createCuerposCub);

router
  .route('/:id')
  .get(getCuerposCub)
  .put(updateCuerposCub)
  .delete(deleteCuerposCub);

module.exports = router;
