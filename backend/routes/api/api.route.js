const express = require('express');

let bodyParser = require('body-parser');

let jsonParser = bodyParser.json();

const router = express.Router();

const userCtrl = require('../../controllers/api/user.controller');

const flightCtrl = require('../../controllers/api/flight.controller');

const collaboratorCtrl = require('../../controllers/api/collaborator.controller');

router.get('/user', jsonParser, userCtrl.index);

router.get('/flight', jsonParser, flightCtrl.index);

router.get('/collaborator/:id/:filterDate', jsonParser, collaboratorCtrl.index);

module.exports = router;