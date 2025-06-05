"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api', routes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});
// Connect to MongoDB
mongoose_1.default.connect(config_1.MONGODB_URI)
    .then(() => {
    console.log('Connected to MongoDB');
    app.listen(config_1.PORT, () => {
        console.log(`Server is running on port ${config_1.PORT}`);
    });
})
    .catch((error) => {
    console.error('MongoDB connection error:', error);
});
