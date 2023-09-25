const express = require('express');
const {
    getQrcode,
    getEncrypt,
    getDecrypt,
    getImages,
    getImagesList,
    getNextHorse
} = require('../controllers/utils');


const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

//  router.use(protect);
//  router.use(authorize('admin','publisher'));

router.get('/qrcode',getQrcode);
router.get('/encrypt',getEncrypt);
router.get('/decrypt',getDecrypt);
router.get('/images',getImages);
router.get('/imagelist', getImagesList);
router.get('/nexthorse',getNextHorse);
module.exports = router;
