const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

const { SENDGRID_API_KEY, FROM_EMAIL } = process.env;

function replaceContent(content, data) {
  let result = content;
  Object.keys(data).forEach(key => {
    const placeholder = new RegExp(`#{${key}}`, 'g');
    result = result.replace(placeholder, data[key]);
  });
  return result;
}

async function sendEmail(templateName, recipientEmail, data) {
  try {
    const templatePath = path.join(__dirname, 'email_templates', templateName);
    const content = await fs.readFile(templatePath, 'utf-8');

    const transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: SENDGRID_API_KEY
      }
    });

    const mailOptions = {
      from: FROM_EMAIL,
      to: recipientEmail,
      subject: data.subject || 'BizNotion Notification',
      html: replaceContent(content, data)
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${recipientEmail}`);
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}

module.exports = sendEmail;
