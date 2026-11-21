const sgMail = require('@sendgrid/mail');
const fs = require('fs');
const path = require('path');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const replaceContent = (template, replacements) => {
  let content = template;
  for (const [key, value] of Object.entries(replacements)) {
    const placeholder = new RegExp(`#{${key}}`, 'g');
    content = content.replace(placeholder, value);
  }
  return content;
};

const sendEmail = async (templateName, to, data) => {
  const { subject, ...replacements } = data;

  const templatePath = path.join(__dirname, 'email_templates', templateName);
  const template = fs.readFileSync(templatePath, 'utf-8');
  const htmlContent = replaceContent(template, replacements);

  const msg = {
    to,
    from: process.env.FROM_EMAIL,
    subject,
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

module.exports = { sendEmail };
