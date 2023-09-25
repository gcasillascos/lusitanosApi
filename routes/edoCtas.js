const express = require('express');

const {
  getEdoCtas,
  createEdoCta,
  getEdoCta,
  updateEdoCta,
  deleteEdoCta,
} = require('../controllers/edoCtas');

const EdoCtas = require('../models/EdoCta');

const cuerpoRouter = require('./cuerpoEdoCtas');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');

const { protect, authorize } = require('../middleware/auth');

router.use('/:edoctaId/cuerpo', cuerpoRouter);

router.use(protect);
router.use(authorize('admin'));

router.route('/').get(advancedResults(EdoCtas), getEdoCtas).post(createEdoCta);

router.route('/:id').get(getEdoCta).put(updateEdoCta).delete(deleteEdoCta);

module.exports = router;
