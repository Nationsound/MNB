const Contact = require('../models/contactSchema');

// Create a new contact message
const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newContact = new Contact({ name, email, message });
    const savedContact = await newContact.save();
    res.status(201).json(savedContact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create contact message' });
  }
};

// (Optional) Get all contact messages
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch contact messages' });
  }
};

module.exports = { createContact, getContacts };
