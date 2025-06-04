import dotenv from 'dotenv';
import twilio from 'twilio';
dotenv.config();

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendSMS({ to, message }: { to: string; message: string }) {
  if (!process.env.TWILIO_PHONE_NUMBER) throw new Error('Missing TWILIO_PHONE_NUMBER in env');
  return twilioClient.messages.create({
    body: message,
    to,
    from: process.env.TWILIO_PHONE_NUMBER,
  });
}
