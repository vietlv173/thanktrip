const express = require('express');

const router = express.Router();

const userCtrl = require('../../controllers/admin/user.controller');

router.get('/index', userCtrl.index);

router.get('/view/:id', userCtrl.view);

router.post('/de-active/:id', userCtrl.deActive);

router.get('/change-password/:id', userCtrl.changePassword);

router.post('/change-password/:id', userCtrl.changePasswordPost);

module.exports = router;