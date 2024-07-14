'use strict';
const express = require('express');
const router = express.Router();
const controller = require('../contollers/customer-controller');
const authService = require('../services/auth-service');


router.post('/', authService.isAdmin, controller.post);
router.get('/', authService.isAdmin, controller.get);
router.get('/check-username/:name', authService.isAdmin, controller.getByName);
router.post('/authenticate', controller.authenticate);
router.post('/refresh-token', authService.authorize, controller.refreshToken);
router.get('/getById/:id', authService.authorize, controller.getById);
router.put('/update-password', authService.authorize, controller.updatePassword);


module.exports = router;