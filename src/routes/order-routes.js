'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../contollers/order-controller');
const authService = require('../services/auth-service');



router.post('/', authService.authorize, controller.post);
router.get('/', authService.authorize, controller.get);
router.get('/sales', authService.authorize, controller.getSales);
router.delete('/:id', authService.isAdmin, controller.delete);
router.delete('/deleteByCode/:code', authService.isAdmin, controller.deleteByCode);

module.exports = router;