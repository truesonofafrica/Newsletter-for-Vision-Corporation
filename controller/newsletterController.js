const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');
const Subscriber = require('../model/subscriberModel');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL, pass: process.env.GMAIL_APP_PASSWORD },
});

// (async () => {
//   const info = await transporter.sendMail({
//     to: GMAIL,
//     subject: 'Hello ✔',
//     text: 'Hello world?', // plain‑text body
//     html: '<b>Hello world?</b>', // HTML body
//   });

//   console.log('Message sent:', info.messageId);
// })();

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
    const { email } = req.body;

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

exports.sendNewsletter = async (req, res) => {
  try {
    const subscribers = await Subscriber.find({ subscribed: true });

    if (!subscribers.length)
      res.status(200).json({ message: 'No active subscribers' });

    const templatePath = path.join(
      process.cwd(),
      'templates',
      'newsletter.html'
    );

    console.log(templatePath);

    const source = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(source);

    for (const subscriber of subscribers) {
      const unsubscribeLink = `${process.env.FRONTEND_URL}/unsubscribe?email=${subscriber.email}`;

      const htmlToSend = template({
        unsubscribe_link: unsubscribeLink,
      });

      await transporter.sendMail({
        from: `"Vision Corporation" <${process.env.GMAIL}>`,
        to: subscriber.email,
        subject: '🌿 Latest Updates from Vision Corporation',
        html: htmlToSend,
      });
    }

    res
      .status(200)
      .json({ message: 'Newsletter sent successfully to all subscribers.' });
  } catch (error) {
    console.error('Error sending newsletter:', error);
    res.status(500).json({ error: 'Failed to send newsletter' });
  }
};
