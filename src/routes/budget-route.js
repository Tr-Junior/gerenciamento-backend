'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../contollers/budget-controller');
const authService = require('../services/auth-service');



router.post('/', authService.authorize, controller.post);
router.get('/', authService.authorize, controller.get);
router.delete('/:id', authService.isAdmin, controller.delete);

module.exports = router;