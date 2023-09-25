const express = require('express');
const {
  getCuentas,
  getCuenta,
  createCuenta,
  updateCuenta,
  deleteCuenta,
} = require('../controllers/cuentas');

const Cuentas = require('../models/Cuenta');

const conceptoRouter = require('./conceptos');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.use('/:cuentaId/concepto', conceptoRouter);

router.use(protect);
router.use(authorize('publisher', 'admin'));

router.route('/').get(advancedResults(Cuentas), getCuentas).post(createCuenta);

router.route('/:id').get(getCuenta).put(updateCuenta).delete(deleteCuenta);

module.exports = router;
