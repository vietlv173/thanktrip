const express = require('express');

const router = express.Router();

const dashboardCtrl = require('../../controllers/admin/dashboard.controller');

router.get('/login', dashboardCtrl.login);

router.post('/login', dashboardCtrl.loginPost);

router.get('/logout', dashboardCtrl.logout);

router.get('/dashboard', dashboardCtrl.dashboard);

module.exports = router;
