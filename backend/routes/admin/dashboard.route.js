const express = require('express');

const router = express.Router();

const dashboardCtrl = require('../../controllers/admin/dashboard.controller');

router.get('/login', dashboardCtrl.login);

router.get('/logout', dashboardCtrl.logout);

router.post('/login', dashboardCtrl.loginPost);

router.get('/register', dashboardCtrl.register);

router.get('/dashboard', dashboardCtrl.dashboard);

router.post('/register', dashboardCtrl.registerPost);

module.exports = router;
