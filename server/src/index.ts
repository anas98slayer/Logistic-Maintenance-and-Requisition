import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import equipmentRoutes from './routes/equipment';
import maintenanceRoutes from './routes/maintenance';
import requisitionRoutes from './routes/requisitions';
import inventoryRoutes from './routes/inventory';
import dashboardRoutes from './routes/dashboard';
import userRoutes from './routes/users';


const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/requisitions', requisitionRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Logistics Maintenance API is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
