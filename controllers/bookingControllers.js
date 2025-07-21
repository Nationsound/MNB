const Booking = require('../models/bookingSchema');
const nodemailer = require('nodemailer');

const createBooking = async (req, res) => {
  try {
    const { service, name, email, message, dateTime } = req.body;
    let fileUrl = req.file ? req.file.path : null;

    // ✅ Convert to Date before saving
    const parsedDateTime = new Date(dateTime);

    const newBooking = new Booking({
      service,
      name,
      email,
      message,
      dateTime: parsedDateTime,
      fileUrl
    });

    await newBooking.save();

    // Email config:
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send to customer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Booking Confirmation',
      text: `Thank you, ${name}! Your booking for ${service} is confirmed. Kindly wait while we email you the procedure on how to make your payment.`,
    });

    // Send to admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'mynationblog305@gmail.com',
      subject: 'New Booking Received',
      text: `New booking: ${name} booked ${service}.`,
    });

    res.status(201).json({ message: 'Booking successful!', booking: newBooking });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Something went wrong!' });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings.' });
  }
};

// Delete booking by ID
const deleteBooking = async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ message: 'Failed to delete booking' });
  }
};

// Update booking by ID
const updateBooking = async (req, res) => {
  try {
    const { service, name, email, message, dateTime } = req.body;

    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { service, name, email, message, dateTime },
      { new: true } // return updated document
    );

    if (!updated) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking updated successfully', booking: updated });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ message: 'Failed to update booking' });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  deleteBooking,
  updateBooking
};
