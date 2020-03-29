const express = require('express');

const router = express.Router();

const transactionCtrl = require('../../controllers/admin/transaction.controller');

router.get('/index', transactionCtrl.index);

router.get('/create', transactionCtrl.create);

router.post('/create', transactionCtrl.createPost);

module.exports = router;