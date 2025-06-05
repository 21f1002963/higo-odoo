"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const messageController_1 = require("../controllers/messageController");
const router = express_1.default.Router();
// All message routes require authentication
router.use(auth_1.auth);
router.post('/', messageController_1.sendMessage);
router.get('/conversations', messageController_1.getConversations);
router.get('/:productId/:userId', messageController_1.getMessages);
router.put('/:messageId/read', messageController_1.markAsRead);
exports.default = router;
