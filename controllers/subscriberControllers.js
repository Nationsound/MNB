// controllers/subscriberController.js
const Subscriber = require('../models/subscriberSchema');
const sendEmail = require('../utils/sendEmail');

// Add subscriber
const addSubscriber = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    // Check if already subscribed
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Already subscribed.' });
    }

    const subscriber = new Subscriber({ email });
    await subscriber.save();

    // Try to send welcome email, but don't fail subscription if email sending fails
    try {
      await sendEmail(
        email,
        'Welcome to My Nation Blog Promotions!',
        'Thank you for subscribing to our amazing deals and updates.',
        `<h2>🎉 Welcome!</h2><p>Thank you for subscribing to our promo offers & updates. Stay tuned!</p>`
      );
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // optional: log to DB or monitoring system
    }

    // Always respond with success since subscriber was saved
    res.status(201).json({ message: 'Subscribed successfully!', subscriber });
  } catch (error) {
    console.error('Error during subscription:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Send promo email to multiple subscribers
const sendPromo = async (req, res) => {
  const { subject, message, html, subscriberIds } = req.body;

  try {
    // Get emails by IDs
    const subscribers = await Subscriber.find({ _id: { $in: subscriberIds } });
    const emails = subscribers.map(s => s.email);

    await sendEmail(
      emails, // array of emails
      subject,
      message,
      html
    );

    res.json({ message: 'Promo emails sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send promo emails.' });
  }
};
// Get all subscribers (for admin)
const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
    res.json(subscribers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Remove subscriber (optional)
const removeSubscriber = async (req, res) => {
  const { id } = req.params;
  try {
    await Subscriber.findByIdAndDelete(id);
    res.json({ message: 'Subscriber removed.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  addSubscriber,
  getSubscribers,
  removeSubscriber,
  sendPromo,
};
