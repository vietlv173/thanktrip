const express = require('express');

const router = express.Router();

const collaboratorCtrl = require('../../controllers/admin/collaborator.controller');

router.get('/index', collaboratorCtrl.index);

router.get('/view/:id', collaboratorCtrl.view);

router.get('/create', collaboratorCtrl.create);

router.get('/update/:id', collaboratorCtrl.update);

router.post('/create', collaboratorCtrl.createPost);

router.post('/update/:id', collaboratorCtrl.updatePost);

router.post('/de-active/:id', collaboratorCtrl.deActive);

router.get('/change-password/:id', collaboratorCtrl.changePassword);

router.post('/change-password/:id', collaboratorCtrl.changePasswordPost);

module.exports = router;
