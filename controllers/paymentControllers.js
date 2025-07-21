const axios = require('axios');
const Payment = require('../models/paymentSchema');

const verifyPayment = async (req, res) => {
  const { reference } = req.body;

  if (!reference) {
    return res.status(400).json({ message: 'Payment reference is required' });
  }

  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${secretKey}`
      }
    });

    const data = response.data;

    if (data.status && data.data.status === 'success') {
      // Save payment details to DB
      const newPayment = await Payment.create({
        reference: data.data.reference,
        amount: data.data.amount,
        currency: data.data.currency,
        status: data.data.status,
        customerEmail: data.data.customer.email,
        channel: data.data.channel,
        paidAt: data.data.paid_at,
      });

      return res.json({
        message: 'Payment verified and saved successfully!',
        payment: newPayment
      });
    } else {
      return res.status(400).json({ message: 'Payment verification failed!' });
    }
  } catch (error) {
    console.error('Payment verification error:', error?.response?.data || error.message);
    return res.status(500).json({ message: 'Internal server error!' });
  }
};

module.exports = { verifyPayment };
