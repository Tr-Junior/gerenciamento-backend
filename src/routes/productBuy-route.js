'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../contollers/productBuy-controller');
const authService = require('../services/auth-service');

router.get('/', authService.authorize, controller.get);
router.post('/', authService.isAdmin, controller.post);
router.put('/update', authService.isAdmin, controller.put);
router.delete('/:id', authService.isAdmin, controller.delete);
router.post('/search', authService.authorize, controller.searchByTitle);

module.exports = router;