const express = require('express');
const router = express.Router();
const { createTicket, getUserTickets, getTicketById, addReply, getAllTickets, closeTicket } = require('../controllers/ticketController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createTicket);
router.get('/', protect, getUserTickets);
router.get('/admin/all', protect, admin, getAllTickets);
router.get('/:id', protect, getTicketById);
router.post('/:id/reply', protect, addReply);
router.put('/:id/close', protect, closeTicket);

module.exports = router;
