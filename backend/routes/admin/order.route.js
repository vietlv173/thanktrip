const express = require('express');

const router = express.Router();

const orderCtrl = require('../../controllers/admin/order.controller');

router.get('/index', orderCtrl.index);

router.get('/create', orderCtrl.create);

router.get('/update/:id', orderCtrl.update);

router.post('/create', orderCtrl.createPost);

router.post('/update/:id', orderCtrl.updatePost);

module.exports = router;