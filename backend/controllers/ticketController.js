const Ticket = require('../models/Ticket');
const Notification = require('../models/Notification');

// @desc    Create a support ticket
// @route   POST /api/tickets
// @access  Private
const createTicket = async (req, res) => {
  const { subject, department, priority, message } = req.body;
  if (!subject || !department || !message) {
    return res.status(400).json({ message: 'Subject, department, and message are required' });
  }

  try {
    const ticket = await Ticket.create({
      user: req.user._id,
      subject,
      department,
      priority: priority || 'Medium',
      messages: [{ sender: req.user._id, text: message }]
    });

    res.status(201).json({ message: 'Ticket created successfully', ticket });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's tickets
// @route   GET /api/tickets
// @access  Private
const getUserTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .populate('messages.sender', 'username firstName role');
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Private
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('user', 'username firstName lastName email')
      .populate('messages.sender', 'username firstName role');

    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    if (ticket.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add reply to ticket
// @route   POST /api/tickets/:id/reply
// @access  Private
const addReply = async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: 'Message is required' });

  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    if (ticket.status === 'Closed') {
      return res.status(400).json({ message: 'Cannot reply to a closed ticket' });
    }

    ticket.messages.push({ sender: req.user._id, text: message });

    // Update status based on who replied
    if (req.user.role === 'admin') {
      ticket.status = 'Awaiting User Reply';
      ticket.assignedTo = req.user._id;
      await Notification.create({
        user: ticket.user,
        title: 'Support Ticket Updated',
        message: `Admin has replied to your ticket: "${ticket.subject}"`,
        type: 'System'
      });
    } else {
      ticket.status = 'In Progress';
    }
    await ticket.save();

    res.json({ message: 'Reply added', ticket });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Admin: Get all tickets
// @route   GET /api/tickets/admin/all
// @access  Private/Admin
const getAllTickets = async (req, res) => {
  try {
    const { status, department } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (department) filter.department = department;

    const tickets = await Ticket.find(filter)
      .sort({ updatedAt: -1 })
      .populate('user', 'username firstName lastName email')
      .populate('assignedTo', 'username firstName');

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Close a ticket
// @route   PUT /api/tickets/:id/close
// @access  Private
const closeTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    ticket.status = 'Closed';
    await ticket.save();
    res.json({ message: 'Ticket closed successfully', ticket });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createTicket, getUserTickets, getTicketById, addReply, getAllTickets, closeTicket };
