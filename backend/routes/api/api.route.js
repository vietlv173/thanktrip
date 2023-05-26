const express = require('express');

let bodyParser = require('body-parser');

let jsonParser = bodyParser.json();

const router = express.Router();

const tourCtrl = require('../../controllers/api/tour.controller');

const userCtrl = require('../../controllers/api/user.controller');

const orderCtrl = require('../../controllers/api/order.controller');

const quoteCtrl = require('../../controllers/api/quote.controller');

const hotelCtrl = require('../../controllers/api/hotel.controller');

const flightCtrl = require('../../controllers/api/flight.controller');

const tranCtrl = require('../../controllers/api/transaction.controller');

const collaboratorCtrl = require('../../controllers/api/collaborator.controller');

router.get('/user', jsonParser, userCtrl.index);

router.get('/tour', jsonParser, tourCtrl.index);

router.get('/transaction/index', jsonParser, tranCtrl.index);

router.post('/transaction/update-status/:id/:status', jsonParser, tranCtrl.updateStatus);

router.post('/tour/update-status', jsonParser, tourCtrl.updateStatus);

router.get('/order', jsonParser, orderCtrl.index);

router.post('/order/update-status', jsonParser, orderCtrl.updateStatus);

router.get('/quote', jsonParser, quoteCtrl.index);

router.get('/hotel', jsonParser, hotelCtrl.index);

router.post('/hotel/update-status', jsonParser, hotelCtrl.updateStatus);

router.get('/flight', jsonParser, flightCtrl.index);

router.get('/collaborator/:id/:filterDate', jsonParser, collaboratorCtrl.index);

module.exports = router;