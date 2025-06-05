"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMS = sendSMS;
const dotenv_1 = __importDefault(require("dotenv"));
const twilio_1 = __importDefault(require("twilio"));
dotenv_1.default.config();
const twilioClient = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
async function sendSMS({ to, message }) {
    if (!process.env.TWILIO_PHONE_NUMBER)
        throw new Error('Missing TWILIO_PHONE_NUMBER in env');
    return twilioClient.messages.create({
        body: message,
        to,
        from: process.env.TWILIO_PHONE_NUMBER,
    });
}
