const express = require('express');

const router = express.Router();

const quoteCtrl = require('../../controllers/admin/quote.controller');

router.get('/index', quoteCtrl.index);

router.get('/create', quoteCtrl.create);

router.get('/view/:id', quoteCtrl.view);

router.get('/public/:id', quoteCtrl.public);

router.get('/update/:id', quoteCtrl.update);

router.post('/create', quoteCtrl.createPost);

router.post('/update/:id', quoteCtrl.updatePost);

module.exports = router;