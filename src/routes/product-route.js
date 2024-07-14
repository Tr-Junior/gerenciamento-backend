'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../contollers/product-controller');
const authService = require('../services/auth-service');

router.get('/', authService.authorize, controller.get);
router.get('/getById/:id', authService.authorize, controller.getById);
router.post('/', authService.isAdmin, controller.post);
router.put('/update/:id', authService.isAdmin, controller.put);
router.put('/updateBody', authService.isAdmin, controller.updateByIdBody);
router.delete('/:id', authService.isAdmin, controller.delete);
// router.get('/search/:title', authService.authorize, controller.getByTitle);
router.post('/search', authService.authorize, controller.searchByTitle);

module.exports = router;