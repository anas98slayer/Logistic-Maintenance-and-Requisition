"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const equipment_1 = __importDefault(require("./routes/equipment"));
const maintenance_1 = __importDefault(require("./routes/maintenance"));
const requisitions_1 = __importDefault(require("./routes/requisitions"));
const inventory_1 = __importDefault(require("./routes/inventory"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const users_1 = __importDefault(require("./routes/users"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Request logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/equipment', equipment_1.default);
app.use('/api/maintenance', maintenance_1.default);
app.use('/api/requisitions', requisitions_1.default);
app.use('/api/inventory', inventory_1.default);
app.use('/api/dashboard', dashboard_1.default);
app.use('/api/users', users_1.default);
app.get('/', (req, res) => {
    res.send('Logistics Maintenance API is running');
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
