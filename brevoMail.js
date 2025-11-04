const axios = require('axios');

const BREVO_URL = 'https://api.brevo.com/v3/smtp/email';

const sendNewsletter = async (toEmail, subject, htmlContent) => {
  try {
    const response = await axios.post(
      BREVO_URL,
      {
        sender: {
          name: 'Vision Corporation',
          email: 'kwesiamissah020@gmail.com',
        },
        to: [
          {
            email: toEmail,
          },
        ],
        subject: subject,
        htmlContent,
      },
      {
        headers: {
          accept: 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json',
        },
      }
    );

    console.log('Email sent successfully', response.data);
    return response.data;
  } catch (error) {
    console.log('Error sending email', error.response?.data || error.message);
  }
};

module.exports = sendNewsletter;
