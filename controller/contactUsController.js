const sendMail = require('../utils/brevoMail');

const brevoContactUs = async (req, res) => {
  try {
    const { name, email, subject, messageCategory, message } = req.body;

    if (!name || !email || !subject || !messageCategory || !message) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'All fields are required' });
    }

    const htmlContent = `
    <h3>Subject: ${subject}</h3>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Category:</strong> ${messageCategory}</p>
    <p><strong>Message:</strong> ${message}</p>
  `;
    await sendMail(
      'Vision Corporation Website Contact Form',
      'visioncorporationafrica@gmail.com',
      'visioncorporationafrica@gmail.com',
      subject,
      htmlContent
    );

    res.status(200).json({
      status: 'success',
      message: 'Your enquiry has been sent successfully!',
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      status: 'fail',
      message: 'Something went wrong while sending the email.',
    });
  }
};

module.exports = brevoContactUs;
