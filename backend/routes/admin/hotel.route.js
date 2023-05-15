const express = require('express');

const router = express.Router();

const hotelCtrl = require('../../controllers/admin/hotel.controller');

router.get('/index', hotelCtrl.index);

router.get('/view/:id', hotelCtrl.view);

router.get('/create', hotelCtrl.create);

router.get('/update/:id', hotelCtrl.update);

router.post('/create', hotelCtrl.createPost);

router.post('/update/:id', hotelCtrl.updatePost);

module.exports = router;