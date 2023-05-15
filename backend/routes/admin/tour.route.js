const express = require('express');

const router = express.Router();

const tourCtrl = require('../../controllers/admin/tour.controller');
const hotelCtrl = require("../../controllers/admin/hotel.controller");

router.get('/index', tourCtrl.index);

router.get('/view/:id', tourCtrl.view);

router.get('/create', tourCtrl.create);

router.get('/update/:id', tourCtrl.update);

router.post('/create', tourCtrl.createPost);

router.post('/update/:id', tourCtrl.updatePost);

module.exports = router;