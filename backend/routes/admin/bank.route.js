const express = require('express');

const router = express.Router();

const bankCtrl = require('../../controllers/admin/bank.controller');

router.get('/index', bankCtrl.index);

router.get('/create', bankCtrl.create);

router.get('/update/:id', bankCtrl.update);

router.post('/create', bankCtrl.createPost);

router.post('/update/:id', bankCtrl.updatePost);

module.exports = router;