const express = require('express');
const {
  getuserPagos,
  getuserPago,
  createuserPago,
  updateuserPago,
  deleteuserPago,
  agregaFormaPago,
  updateFormaPago,
  deleteFormaPago,
} = require('../controllers/userPagos');


// const {
//   createPreRegistro,

// } = require('../controllers/preRegistros');

const userPagos = require('../models/pagos/UserPago');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');

// Include other resource routers
const horseRouter = require('./horses');

// const preRegRouter = require('./preRegistros');
// const valoracionRouter = require('./valoraciones');

const { protect, authorize } = require('../middleware/auth');


// Re-route into other resource routers
router.use('/:userPagoId/horses', horseRouter);


router
  .route('/')
  .get(protect,authorize('publisher', 'admin'), advancedResults(userPagos),  getuserPagos)
  .post(protect,authorize('admin'), createuserPago);

router
  .route('/:id')
  
  .get( protect, authorize('publisher', 'admin'), getuserPago)
  .put(protect, authorize('publisher', 'admin'), updateuserPago)
  .delete(protect, authorize('publisher', 'admin'), deleteuserPago);

router
  .route('/:id/fpago')
  .post( protect, authorize('publisher', 'admin'), agregaFormaPago)
  .put( protect, authorize('publisher', 'admin'), updateFormaPago)
  .delete( protect, authorize('publisher', 'admin'), deleteFormaPago)

module.exports = router;
