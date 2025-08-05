const Booking = require('../models/bookingSchema');
const nodemailer = require('nodemailer');
const cloudinary = require('../utils/cloudinary');
const streamifier = require('streamifier');

// helper: upload buffer to Cloudinary (supports image/pdf/audio/video with auto)
function uploadBufferToCloudinary(buffer, folder = process.env.CLOUDINARY_FOLDER || 'mnb') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// Create booking
const createBooking = async (req, res) => {
  try {
    const { service, name, email, message, dateTime } = req.body;

    // Parse date to Date object
    const parsedDateTime = dateTime ? new Date(dateTime) : undefined;

    let fileUrl, filePublicId;
    if (req.file) {
      const up = await uploadBufferToCloudinary(req.file.buffer);
      fileUrl = up.secure_url;
      filePublicId = up.public_id;
    }

    const newBooking = await Booking.create({
      service,
      name,
      email,
      message,
      dateTime: parsedDateTime,
      ...(fileUrl ? { fileUrl, filePublicId } : {})
    });

    // Email config (Gmail requires App Password if 2FA enabled)
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Customer mail
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Booking Confirmation',
      text: `Thank you, ${name}! Your booking for ${service} is confirmed. Kindly wait while we email you the procedure on how to make your payment.`,
    });

    // Admin mail
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'mynationblog305@gmail.com',
      subject: 'New Booking Received',
      text: `New booking: ${name} booked ${service}.`,
    });

    res.status(201).json({ message: 'Booking successful!', booking: newBooking });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Something went wrong!', error: error.message });
  }
};

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings.', error: error.message });
  }
};

// Delete booking by ID (also delete Cloudinary asset if any)
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.filePublicId) {
      try {
        await cloudinary.uploader.destroy(booking.filePublicId, { resource_type: 'auto' });
      } catch (e) {
        console.warn('Could not delete booking file from Cloudinary:', e.message);
      }
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ message: 'Failed to delete booking', error: error.message });
  }
};

// Update booking by ID (replace file if new one provided)
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const { service, name, email, message, dateTime } = req.body;

    const update = {
      service: service ?? booking.service,
      name: name ?? booking.name,
      email: email ?? booking.email,
      message: message ?? booking.message,
      dateTime: dateTime ? new Date(dateTime) : booking.dateTime,
    };

    if (req.file) {
      const up = await uploadBufferToCloudinary(req.file.buffer);
      update.fileUrl = up.secure_url;
      update.filePublicId = up.public_id;

      // delete old file if existed
      if (booking.filePublicId) {
        try {
          await cloudinary.uploader.destroy(booking.filePublicId, { resource_type: 'auto' });
        } catch (e) {
          console.warn('Could not delete old booking file from Cloudinary:', e.message);
        }
      }
    }

    const updated = await Booking.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ message: 'Booking updated successfully', booking: updated });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ message: 'Failed to update booking', error: error.message });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  deleteBooking,
  updateBooking
};
