const express = require('express');

const router = express.Router();

const flightCtrl = require('../../controllers/admin/flight.controller');

router.get('/view/:id', flightCtrl.view);

router.get('/index', flightCtrl.index);

module.exports = router;
