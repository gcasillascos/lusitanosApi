const express = require('express');
const {
  getPedigrees,
  getPedigreesAll,
  getPedigreeByNum,
  getPedigreeByName,
  addPedigree,
  updatePedigree,
  deletePedigree,
} = require('../controllers/pedigrees');

const Pedigrees = require('../models/Pedigree');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');

const { protect, authorize } = require('../middleware/auth');

// router.use(protect);

router.route('/').get(advancedResults(Pedigrees), getPedigrees);
/* .post(protect, authorize('publisher', 'admin'), addPedigree) */

router.route('/:id').get(getPedigreeByNum);
/*   .put(protect, authorize('publisher', 'admin'), updatePedigree)
  .delete(protect, authorize('publisher', 'admin'), deletePedigree) */

router.route('/name/:name/:sex')
   .get(protect, authorize('publisher', 'admin'), getPedigreeByName) 

/* .put(authorize('publisher','admin'),updateOwner)
  .delete(authorize('admin'), deleteOwner);

router
.route('/photo/:id').put(protect, authorize('publisher', 'admin'), ownerPhotoUpload); */

module.exports = router;
