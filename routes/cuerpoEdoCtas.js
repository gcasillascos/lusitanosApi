const express = require('express');
const {
  getCuerpos,
  getCuerpo,
  createCuerpo,
  updateCuerpo,
  deleteCuerpo,
} = require('../controllers/cuerposEdoCta');

const Cuerpos = require('../models/CuerpoEdoCta');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.route('/').get(advancedResults(Cuerpos), getCuerpos).post(createCuerpo);

router.route('/:id').get(getCuerpo).put(updateCuerpo).delete(deleteCuerpo);

module.exports = router;
