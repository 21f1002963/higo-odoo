"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const productController_1 = require("../controllers/productController");
const router = express_1.default.Router();
// Public routes
router.get('/', productController_1.getProducts);
router.get('/:id', productController_1.getProduct);
// Protected routes
router.post('/', auth_1.auth, productController_1.createProduct);
router.put('/:id', auth_1.auth, productController_1.updateProduct);
router.delete('/:id', auth_1.auth, productController_1.deleteProduct);
router.post('/:id/bid', auth_1.auth, productController_1.placeBid);
router.post('/:id/save', auth_1.auth, productController_1.saveProduct);
exports.default = router;
