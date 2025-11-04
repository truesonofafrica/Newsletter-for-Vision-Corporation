const jwt = require('jsonwebtoken');
const Subscriber = require('../model/subscriberModel');
const sendNewsletter = require('../brevoMail');
const { renderTemplate } = require('../utils/renderTemplate');

exports.subscribeUser = async (req, res) => {
  try {
    const { email } = req.body;

    const subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      if (!subscriber.subscribed) {
        subscriber.subscribed = true;
        await subscriber.save();
        return res
          .status(200)
          .json({ status: 'success', message: 'Resubscribed successfully' });
      }
      return res
        .status(400)
        .json({ status: 'success', message: 'Already a subscriber' });
    }

    await Subscriber.create({ email });

    res
      .status(200)
      .json({ status: 'success', message: 'Subscribed successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: 'fail', message: 'Failed to subscribe' });
  }
};

exports.unsubscribeUser = async (req, res) => {
  try {
    const { email, token } = req.query;
    if (!email || !token)
      return res.status(400).json({ message: 'Email and token are required' });

    const decoded = jwt.verify(token, process.env.UNSUBSCRIBE_SECRET);

    if (decoded.email !== email) {
      return res.status(403).json({ message: 'Invalid unsubscribe token' });
    }

    const subscriber = await Subscriber.findOne({ email });

    if (!subscriber)
      return res.status(404).send('<h2>Subscriber not found</h2>');

    subscriber.subscribed = false;
    await subscriber.save();

    // res.status(200).send('<h2>You have been unsubscribed successfully</h2>');
    res
      .status(200)
      .json({ message: 'You have been unsubscribed successfully' });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: 'Failed to unsubscribe' });
  }
};

exports.sendNewsletterToAll = async (req, res) => {
  try {
    const subscribers = await Subscriber.find({ subscribed: true });

    if (!subscribers.length)
      res.status(200).json({ message: 'No active subscribers' });

    const { templateName, subject, heading, message, buttonText, buttonUrl } =
      req.body;

    for (const subscriber of subscribers) {
      const token = subscriber.generateUnsubscribeToken();

      const unsubscribeUrl = `${process.env.FRONTEND_URL}/unsubscribe?email=${subscriber.email}&token=${token}`;

      const htmlContent = renderTemplate(templateName, {
        subject,
        heading,
        message,
        buttonText,
        buttonUrl,
        unsubscribeUrl,
      });

      await sendNewsletter(subscriber.email, subject, htmlContent);
    }

    res
      .status(200)
      .json({ message: 'Newsletter sent successfully to all subscribers.' });
  } catch (error) {
    console.error('Error sending newsletter:', error);
    res.status(500).json({ error: 'Failed to send newsletter' });
  }
};
