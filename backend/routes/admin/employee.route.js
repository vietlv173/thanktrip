const express = require('express');

const router = express.Router();

const employeeCtrl = require('../../controllers/admin/employee.controller');

router.get('/index', employeeCtrl.index);

router.get('/view/:id', employeeCtrl.view);

router.get('/create', employeeCtrl.create);

router.get('/update/:id', employeeCtrl.update);

router.post('/create', employeeCtrl.createPost);

router.post('/update/:id', employeeCtrl.updatePost);

router.get('/change-password/:id', employeeCtrl.changePassword);

router.post('/change-password/:id', employeeCtrl.changePasswordPost);

module.exports = router;
