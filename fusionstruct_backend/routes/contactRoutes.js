const express = require('express');
const router = express.Router();
const { createContact, getContacts } = require('../controllers/contactController');

// POST (client form)
router.post('/', createContact);

// GET (admin view)
router.get('/', getContacts);

module.exports = router;
