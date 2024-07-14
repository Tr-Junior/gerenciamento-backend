'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../contollers/exits-controller');
const authService = require('../services/auth-service');

router.get('/', authService.isAdmin, controller.get);
router.get('/getById/:id', authService.isAdmin, controller.getById);
router.post('/', authService.isAdmin, controller.post);
router.put('/update', authService.isAdmin, controller.put);
router.delete('/:id', authService.isAdmin, controller.delete);
router.get('/search/:title', authService.isAdmin, controller.getByTitle);



module.exports = router;