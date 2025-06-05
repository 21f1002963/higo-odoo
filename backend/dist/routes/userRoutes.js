"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
// Public routes
router.post('/register', userController_1.register);
router.post('/login', userController_1.login);
router.get('/:userId/products', userController_1.getUserProducts);
router.get('/:userId/reviews', userController_1.getUserReviews);
// Protected routes
router.get('/profile', auth_1.auth, userController_1.getProfile);
router.put('/profile', auth_1.auth, userController_1.updateProfile);
router.post('/:userId/reviews', auth_1.auth, userController_1.addReview);
exports.default = router;
