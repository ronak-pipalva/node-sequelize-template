import path from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';
import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize SES client
const ses = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_MAIL_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_MAIL_SECRET_ACCESS_KEY,
  },
});

const sendMailSES = async (obj) => {
  if (!Array.isArray(obj.to)) {
    obj.to = [obj.to];
  }

  // Render EJS HTML template
  let htmlText = '';
  if (obj.template) {
    try {
      const rootDir = path.resolve(__dirname, '..');
      const templatePath = path.join(rootDir, obj.template.replace(/^\/+/, ''), 'html.ejs');
      htmlText = await ejs.renderFile(templatePath, obj.data || {});
    } catch (error) {
      console.error('Error rendering email template:', error);
      throw new Error('Failed to render email template.');
    }
  }

  const emailParams = {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: obj.to,
      CcAddresses: obj.cc || [],
      BccAddresses: obj.bcc || [],
    },
    Message: {
      Subject: { Data: obj.subject || 'Default Subject' },
      Body: {
        Html: {
          Data: htmlText,
        },
      },
    },
  };

  try {
    const result = await ses.send(new SendEmailCommand(emailParams));
    return result;
  } catch (error) {
    console.error('SES SendEmail Error:', error);
    throw error;
  }
};

export { sendMailSES };
