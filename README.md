# FleetPro - Logistics Maintenance Management System

A comprehensive full-stack web application for managing equipment maintenance, inventory tracking, and supply requisitions in logistics warehouse environments. Built as a complete university Software Engineering course project.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.12-06B6D4?logo=tailwindcss)
![Express.js](https://img.shields.io/badge/Express.js-5.2.1-000000?logo=express)
![Prisma](https://img.shields.io/badge/Prisma-6.2.1-2D3748?logo=prisma)
![SQLite](https://img.shields.io/badge/SQLite-07405E?logo=sqlite&logoColor=white)

## 📋 Overview

**FleetPro** is a production-ready web application designed to streamline maintenance operations, equipment tracking, and inventory management for logistics and warehouse facilities. It provides real-time dashboards, equipment health monitoring, and automated requisition workflows to minimize downtime and optimize resource allocation.

### Key Features

- **Real-time Dashboard**: Visual analytics for maintenance status, equipment health, and operational metrics with Recharts visualizations
- **Maintenance Management**: Create, track, and update maintenance requests with priority levels and technician assignment
- **Equipment Tracking**: Comprehensive registry of logistics assets with health status monitoring and maintenance scheduling
- **Inventory Management**: Stock level tracking with automated low-stock alerts and supplier information
- **Requisition Workflow**: Streamlined supply request submission and admin approval/rejection process
- **User Authentication**: Secure JWT-based authentication with role-based access control (Admin/Technician)
- **User Management**: Admin can manage users, update roles, and delete accounts (with self-deletion prevention)
- **Responsive Design**: Fully responsive interface optimized for desktop use with modern UI components

## 🏗️ Architecture

The system follows a modern 3-tier architecture with comprehensive role-based access control:

```
Client (React SPA) → Express REST API → SQLite Database (Prisma ORM)
```

### Technology Stack

**Frontend:**
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized production builds
- **Tailwind CSS 4.1.12** with custom design system and theme variables
- **Radix UI** (40+ components) for accessible, unstyled UI primitives
- **Recharts** for interactive data visualizations (Pie charts, Bar charts)
- **React Router 7** for client-side navigation with protected routes
- **Lucide React** for beautiful, consistent icons
- **React Hook Form** for form validation and management

**Backend:**
- **Express.js 5.2.1** REST API server with TypeScript
- **Prisma ORM 6.2.1** for type-safe database operations and migrations
- **SQLite** for portable, file-based database storage (ideal for demos)
- **JWT (jsonwebtoken)** for stateless authentication with 24-hour tokens
- **bcryptjs** for secure password hashing
- **Zod** for runtime validation and type safety
- **CORS** for cross-origin resource sharing

**Development Tools:**
- **TypeScript 5.0+** across both frontend and backend
- **ts-node-dev** for hot-reloading backend development
- **Prisma Studio** for visual database management
- **Vite** for fast frontend development server

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** and npm/yarn/pnpm
- Modern web browser (Chrome, Firefox, Edge)
- Git for version control

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/logistics-maintenance-system.git
   cd logistics-maintenance-system
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Set up the database**
   ```bash
   cd server
   npx prisma migrate dev --name init
   npx prisma db seed
   cd ..
   ```

5. **Start both development servers**
   ```bash
   # Terminal 1: Start backend server (port 3001)
   cd server
   npm run dev
   
   # Terminal 2: Start frontend server (port 5173)
   cd ..
   npm run dev
   ```

6. **Open your browser** and navigate to `http://localhost:5173`

### Default Login Credentials

The seed script creates the following users:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@logistic.com` | `admin123` |
| Technician | `tech@logistic.com` | `tech123` |

### Building for Production

```bash
# Build frontend
npm run build

# Build backend
cd server
npm run build
cd ..
```

The built frontend files will be in the `dist` directory, and backend files in `server/dist`.

## 📁 Project Structure

```
├── src/                          # Frontend source code
│   ├── app/                     # React application
│   │   ├── components/         # 40+ UI components (Dashboard, Lists, Auth)
│   │   │   ├── figma/          # Image handling components
│   │   │   └── ui/             # 40+ Radix UI based components
│   │   ├── context/            # AuthContext for global state management
│   │   ├── lib/                # API client utilities and helpers
│   │   └── routes.ts           # Application routing configuration
│   ├── styles/                 # CSS and theme files (Tailwind, fonts)
│   └── main.tsx                # Application entry point
├── server/                      # Backend Express server
│   ├── src/                    # Server source code
│   │   ├── lib/               # Prisma client and utilities
│   │   ├── middleware/        # Authentication and authorization middleware
│   │   ├── routes/            # 7 API route handlers (auth, equipment, etc.)
│   │   └── index.ts           # Express server setup and configuration
│   ├── prisma/                 # Database schema and migrations
│   │   ├── schema.prisma      # Complete database schema with 5 models
│   │   └── seed.ts            # Seed data script with realistic test data
│   └── package.json            # Backend dependencies and scripts
├── documentation/              # Complete SWE project documentation
│   ├── SRS.md                 # Software Requirements Specification
│   ├── ARCHITECTURE.md        # System architecture documentation
│   ├── ERD.md                 # Entity Relationship Diagram
│   ├── USE_CASES.md           # Use case analysis
│   └── API_DOCS.md            # Complete API documentation
├── guidelines/                 # Development guidelines
├── public/                    # Static assets
├── deployment-guide.md        # Netlify + Render deployment instructions
├── netlify.toml              # Netlify configuration
├── vite.config.ts            # Vite configuration
├── postcss.config.mjs        # PostCSS configuration
├── package.json              # Frontend dependencies and scripts
└── README.md                 # This file
```

## 🔐 Authentication & Authorization

The system implements comprehensive role-based access control with two primary user roles and granular permissions:

### User Roles

**Admin:**
- Full CRUD access to all modules (equipment, inventory, maintenance, requisitions)
- User management (create, update roles, delete users with self-deletion prevention)
- Requisition approval/rejection authority
- Inventory deletion privileges
- Access to all dashboard analytics and reports

**Technician:**
- View-only access to equipment and inventory listings
- Create maintenance requests for specific equipment
- Submit supply requisitions with cost estimation
- Update status of their own assigned maintenance tasks
- Cancel their own pending maintenance requests
- View dashboard with relevant metrics

### Security Features
- **JWT Authentication**: All API routes (except `/api/auth/*`) require Bearer token authorization
- **Password Hashing**: bcryptjs with salt rounds for secure password storage
- **Token Expiration**: JWT tokens expire after 24 hours
- **Middleware Protection**: Route-level authorization with `authenticateToken` and `authorizeRole` middleware
- **Input Validation**: Zod schema validation for all API requests
- **SQL Injection Prevention**: Prisma ORM with parameterized queries

## 📊 API Documentation

The backend provides a comprehensive RESTful API with 7 route modules. Complete documentation is available in [API_DOCS.md](documentation/API_DOCS.md).

### Authentication (`/api/auth`)
- `POST /api/auth/register` - User registration with role assignment (max 5 technicians)
- `POST /api/auth/login` - JWT token generation with email/password
- `GET /api/auth/me` - Get current authenticated user profile (protected)

### Maintenance (`/api/maintenance`)
- `GET /api/maintenance` - List all maintenance requests with equipment/user relationships
- `POST /api/maintenance` - Create new maintenance request (Technician only)
- `PUT /api/maintenance/:id` - Update maintenance status/assignment with role-based permissions
- `DELETE /api/maintenance/:id` - Delete maintenance request (Admin only)
- `GET /api/maintenance/technicians` - List available technicians for assignment (Admin only)

### Equipment (`/api/equipment`)
- `GET /api/equipment` - List all equipment with status and maintenance history
- `POST /api/equipment` - Create new equipment record (Admin only)
- `PUT /api/equipment/:id` - Update equipment details (Admin only)
- `DELETE /api/equipment/:id` - Delete equipment (Admin only)

### Inventory (`/api/inventory`)
- `GET /api/inventory` - List all inventory items with stock levels
- `POST /api/inventory` - Create new inventory item (Admin only)
- `PUT /api/inventory/:id` - Update inventory quantity or restock
- `DELETE /api/inventory/:id` - Delete inventory item (Admin only)

### Requisitions (`/api/requisitions`)
- `GET /api/requisitions` - List all requisitions with requester information
- `POST /api/requisitions` - Create new supply requisition
- `PUT /api/requisitions/:id` - Update requisition status (Admin only for approval/rejection)
- `DELETE /api/requisitions/:id` - Delete requisition (Admin only)

### Dashboard (`/api/dashboard`)
- `GET /api/dashboard/stats` - Aggregated system statistics for dashboard visualization

### Users (`/api/users`)
- `GET /api/users` - List all users (Admin only)
- `PUT /api/users/:id/role` - Update user role (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only, prevents self-deletion)

## 🎨 Design System

The application uses a comprehensive design system defined in `src/styles/theme.css` with:

### Color Palette
- **Primary Color**: `#030213` (Dark Blue/Black) for brand identity
- **Status Colors**: 
  - Operational: `#10b981` (Emerald)
  - Under Maintenance: `#f59e0b` (Amber)
  - Out of Service: `#ef4444` (Red)
  - Pending: `#8b5cf6` (Purple)
  - Approved: `#3b82f6` (Blue)
- **Neutral Scale**: `#f8fafc` to `#0f172a` for backgrounds, text, and borders

### Typography
- **Primary Font**: Outfit family (sans-serif) with responsive sizing
- **Font Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold), 800 (Extrabold), 900 (Black)
- **Scale**: Responsive typography with clamp() for fluid sizing

### Spacing & Layout
- **Spacing Scale**: Tailwind's 0.25rem increments (0, 0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96)
- **Border Radius**: Consistent rounded corners (0.375rem, 0.5rem, 0.75rem, 1rem, 1.5rem, 2rem)
- **Shadows**: Subtle elevation system with multiple shadow levels

### Components
- **40+ Radix UI Components**: Unstyled, accessible primitives with custom styling
- **Custom Components**: Dashboard cards, data tables, forms, navigation sidebar
- **Interactive States**: Hover, focus, active, and disabled states for all interactive elements
- **Animations**: Smooth transitions and micro-interactions for better UX

## 🧪 Testing & Quality Assurance

### Manual Testing Scenarios

**Authentication Flow:**
1. Register new user with valid credentials
2. Login with correct credentials → Receive JWT token
3. Access protected routes with valid token
4. Attempt to access protected routes without token → 401 Unauthorized
5. Attempt to access admin-only routes as technician → 403 Forbidden

**CRUD Operations:**
1. Create maintenance request → Verify persistence in database
2. Update maintenance status → Verify status change reflects in UI
3. Delete equipment as admin → Verify removal from database
4. Attempt to delete as technician → Verify permission denied

**Role-Based Access Control:**
1. Admin can delete users (except themselves)
2. Technician can only update their own assigned tasks
3. Admin can approve/reject requisitions
4. Technician can only view inventory, not delete

### Database Validation
- All foreign key constraints are enforced
- Cascade deletion works correctly (equipment deletion removes related maintenance)
- Unique constraints prevent duplicate emails
- Default values are applied correctly (status, timestamps)

### Performance Testing
- Dashboard stats load in <500ms with realistic dataset
- API responses are optimized with proper indexing
- Frontend components are memoized for better performance
- Images are optimized with fallbacks

## 📈 Deployment

The system is designed for deployment using a split architecture: **Netlify** for the frontend and **Render** for the backend. This provides optimal performance and reliability on free tiers. Complete deployment instructions are available in [deployment-guide.md](deployment-guide.md).

### Backend Deployment (Render.com)

1. **Create an account** at [Render.com](https://render.com)
2. **Create a New Web Service** and connect your GitHub repository
3. **Configure Build & Start**:
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npm run prisma:generate && npm run build`
   - **Start Command**: `npm run start`
4. **Add Environment Variables**:
   - `DATABASE_URL`: `file:./dev.db` (Note: For production persistence, consider using Supabase PostgreSQL)
   - `JWT_SECRET`: A secure random string (minimum 32 characters)
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render's default)

### Frontend Deployment (Netlify)

1. **Sign in to Netlify** at [Netlify.com](https://netlify.com)
2. **Add New Site** → "Import from Git" and select your repository
3. **Site Configuration**:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. **Environment Variables**:
   - `VITE_API_URL`: Your Render service URL followed by `/api` (e.g., `https://your-backend.onrender.com/api`)

### Database Persistence Considerations

**For University Projects/Demos (SQLite):**
- SQLite is perfect for submissions and demonstrations
- Database file is included in the repository
- Zero setup required for grading or evaluation
- Data persists across server restarts in local development

**For Production Use (Supabase PostgreSQL):**
1. Create a free project on [Supabase.com](https://supabase.com)
2. Copy the "Transaction" connection string from Database Settings
3. Update `DATABASE_URL` in Render environment variables
4. Change `provider = "sqlite"` to `provider = "postgresql"` in `schema.prisma`
5. Run `npx prisma db push` to sync schema
6. Run `npx prisma db seed` to populate with initial data

### Deployment Checklist
- [ ] Backend health check returning 200 at `/api/health`
- [ ] Frontend `VITE_API_URL` environment variable set correctly
- [ ] Database seeded with initial users (admin@logistic.com / admin123)
- [ ] Netlify redirects configured via `netlify.toml`
- [ ] CORS properly configured for production domains
- [ ] JWT_SECRET is strong and unique

## 🤝 Contributing & Development

### Development Workflow

1. **Fork the repository** and clone it locally
2. **Create a feature branch**: `git checkout -b feature/your-feature`
3. **Install dependencies**: Run `npm install` in root and `cd server && npm install`
4. **Set up database**: `cd server && npx prisma migrate dev && npx prisma db seed`
5. **Make your changes** following the code style guidelines
6. **Test your changes**: Verify both frontend and backend functionality
7. **Commit with descriptive messages**: Use conventional commit format
8. **Push to your fork**: `git push origin feature/your-feature`
9. **Open a Pull Request** with detailed description of changes

### Code Style Guidelines

- **TypeScript**: Strict mode enabled, explicit return types for functions
- **React**: Functional components with hooks, proper prop typing
- **Tailwind CSS**: Use utility classes, avoid custom CSS when possible
- **Naming**: PascalCase for components, camelCase for variables/functions
- **Imports**: Group imports (React, third-party, local), alphabetical order
- **Error Handling**: Try/catch blocks with proper error messages
- **Comments**: JSDoc for complex functions, inline comments for non-obvious logic

### Project Standards

- **Database**: All changes require Prisma migrations (`npx prisma migrate dev`)
- **API**: Follow REST conventions, proper HTTP status codes
- **Authentication**: All routes (except auth) must be protected
- **Validation**: Use Zod schemas for all API input validation
- **Testing**: Manual testing of all user flows required

## 📄 License

This project is licensed under the MIT License.

## 📚 Complete Software Engineering Documentation

This project includes comprehensive documentation suitable for university Software Engineering courses:

### Core Documentation
- **[Software Requirements Specification](documentation/SRS.md)** - IEEE 830 template with functional/non-functional requirements
- **[System Architecture](documentation/ARCHITECTURE.md)** - 3-tier architecture with component breakdown and diagrams
- **[Entity Relationship Diagram](documentation/ERD.md)** - Complete database schema with relationships in Mermaid format
- **[Use Case Analysis](documentation/USE_CASES.md)** - Actor-based use cases with diagrams and descriptions
- **[API Documentation](documentation/API_DOCS.md)** - Complete REST API reference with endpoints and examples

### Development Documentation
- **[Deployment Guide](deployment-guide.md)** - Step-by-step Netlify + Render deployment instructions
- **[Project Plan](plan1.md)** - Original transformation plan from Figma to full-stack application
- **[Development Guidelines](guidelines/Guidelines.md)** - Code style and best practices

### Database Documentation
- **5 Data Models**: User, Equipment, MaintenanceRequest, Requisition, InventoryItem
- **Relationships**: Foreign key constraints with cascade deletion
- **Seed Data**: Realistic test data for demonstration and testing
- **Migrations**: Prisma migration history for schema evolution

### Security Documentation
- **Authentication**: JWT implementation with 24-hour expiration
- **Authorization**: Role-based access control (Admin/Technician)
- **Validation**: Input validation with Zod schemas
- **Password Security**: bcryptjs hashing with salt rounds

## 🆘 Support

For support, please:
1. Check the [documentation](documentation/) first
2. Review existing issues on GitHub
3. Create a new issue with detailed information about your problem

## 🙏 Acknowledgments & Attributions

### Open Source Libraries
- **[Radix UI](https://www.radix-ui.com/)** - Accessible, unstyled UI primitives (MIT License)
- **[Recharts](https://recharts.org/)** - Composable charting library built with React (MIT License)
- **[Lucide Icons](https://lucide.dev/)** - Beautiful & consistent icon toolkit (ISC License)
- **[Prisma](https://www.prisma.io/)** - Next-generation ORM for TypeScript & Node.js (Apache 2.0)
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework (MIT License)
- **[React Hook Form](https://react-hook-form.com/)** - Performant, flexible forms with easy validation (MIT License)
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation (MIT License)

### Design Resources
- **Figma Design System** - Original UI design and component structure
- **Color Palette** - Custom logistics-themed color scheme
- **Typography** - Outfit font family for modern, readable interface

### Educational Resources
- **Software Engineering Principles** - Applied SWE methodologies throughout development
- **Database Design** - Proper normalization and relationship modeling
- **Security Best Practices** - JWT authentication, password hashing, input validation

---

**Built as a comprehensive Software Engineering course project**  
**Demonstrating full-stack development, database design, and system architecture**