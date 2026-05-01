# Deployment Guide: FleetPro - Logistics Maintenance Management System

This guide provides comprehensive instructions for deploying the Logistics Maintenance Management System using a split architecture: **Netlify** for the frontend and **Render** for the backend. This approach provides optimal performance and reliability on free tiers while maintaining separation of concerns.

## System Overview

**Deployment Architecture:**
```
Frontend (React SPA) → Netlify (Static Hosting)
Backend (Express API) → Render (Node.js Hosting)
Database (SQLite/PostgreSQL) → File-based or Supabase
```

**Key Considerations:**
- **Free Tier Friendly**: Both Netlify and Render offer generous free tiers
- **Scalability**: Architecture supports upgrading to paid plans as needed
- **Security**: Environment variables for sensitive configuration
- **Persistence**: SQLite for demos, PostgreSQL for production data

---

## Part 1: Backend Deployment (Render.com)

### Step 1: Create Render Account
1. **Sign up** at [Render.com](https://render.com) using GitHub, GitLab, or email
2. **Verify email** and complete account setup

### Step 2: Create Web Service
1. Click **"New +"** → **"Web Service"**
2. **Connect your GitHub repository** containing the project
3. **Configure service settings**:
   - **Name**: `logistics-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users (US/EU)
   - **Branch**: `main` (or your deployment branch)
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npm run prisma:generate && npm run build`
   - **Start Command**: `npm run start`

### Step 3: Configure Environment Variables
Add these variables in Render dashboard under **"Environment"** section:

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | `file:./dev.db` | SQLite database file path |
| `JWT_SECRET` | `your-32-character-secret-here` | Secure random string for JWT signing |
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `10000` | Render's default port (optional) |

**JWT_SECRET Generation:**
```bash
# Generate a secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Deploy & Verify
1. Click **"Create Web Service"** to start deployment
2. Monitor build logs for any errors
3. Once deployed, note your service URL (e.g., `https://logistics-backend.onrender.com`)

### Step 5: Seed Production Database
1. Go to Render dashboard → **"Shell"** tab
2. Run the seed command:
   ```bash
   npx prisma db seed
   ```
3. Verify seed data was created successfully

---

## Part 2: Frontend Deployment (Netlify)

### Step 1: Prepare Repository
Ensure your repository has:
- `netlify.toml` configuration file
- Proper `.gitignore` for node_modules
- All code committed and pushed

### Step 2: Deploy to Netlify
1. **Sign in** to [Netlify.com](https://netlify.com)
2. Click **"Add new site"** → **"Import from Git"**
3. **Select your Git provider** (GitHub, GitLab, etc.)
4. **Choose your repository**
5. **Configure build settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Branch to deploy**: `main`

### Step 3: Configure Environment Variables
Add these variables in Netlify dashboard under **"Site settings"** → **"Environment variables"**:

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | `https://your-backend.onrender.com/api` | Your Render backend URL |
| `NODE_VERSION` | `18` | Node.js version for build |

**Important**: Replace `your-backend.onrender.com` with your actual Render service URL.

### Step 4: Deploy & Verify
1. Click **"Deploy site"**
2. Monitor build process in Netlify dashboard
3. Once deployed, note your site URL (e.g., `https://fleetpro-maintenance.netlify.app`)
4. Test the application by visiting the URL

---

## 🛠️ Database Persistence Options

### Option A: SQLite (Default - Ideal for Demos/University Projects)
**Pros:**
- Zero setup required
- Database file included in repository
- Perfect for project submissions and demonstrations
- Data persists across server restarts in local development

**Cons on Render Free Tier:**
- Ephemeral storage (database resets on server restart/redeploy)
- Not suitable for production with persistent data needs

**Workaround for University Projects:**
1. Include `server/prisma/dev.db` in your Git repository
2. Render will use this file during deployment
3. For grading/evaluation, the database will contain seed data

### Option B: Supabase PostgreSQL (Recommended for Production)
**Step-by-Step Migration:**

1. **Create Supabase Project:**
   - Go to [Supabase.com](https://supabase.com)
   - Click **"New project"**
   - Name: `fleetpro-maintenance`
   - Database password: Generate secure password
   - Region: Choose closest to your users
   - Click **"Create new project"** (takes 1-2 minutes)

2. **Get Connection String:**
   - Go to **Project Settings** → **Database**
   - Copy **"Connection string"** under **"Connection info"**
   - Format: `postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres`

3. **Update Backend Configuration:**
   - In Render dashboard, update `DATABASE_URL` environment variable with Supabase connection string
   - In `server/prisma/schema.prisma`, change:
     ```prisma
     provider = "sqlite"  →  provider = "postgresql"
     ```

4. **Deploy Database Schema:**
   ```bash
   # In Render Shell or locally
   npx prisma db push
   npx prisma db seed
   ```

5. **Verify Connection:**
   - Check Prisma Studio: `npx prisma studio`
   - Verify tables and data are created

**Supabase Free Tier Benefits:**
- 500MB database + 1GB bandwidth
- Unlimited API requests
- Realtime subscriptions
- Auto-backups

---

## 📁 Complete Deployment Checklist

### Pre-Deployment Verification
- [ ] Code committed and pushed to Git repository
- [ ] All tests pass locally
- [ ] Database seeded with test data
- [ ] Environment variables documented

### Backend (Render) Checklist
- [ ] Render web service created
- [ ] Root directory set to `server`
- [ ] Build command: `npm install && npm run prisma:generate && npm run build`
- [ ] Start command: `npm run start`
- [ ] `DATABASE_URL` environment variable set
- [ ] `JWT_SECRET` environment variable set (32+ characters)
- [ ] `NODE_ENV` set to `production`
- [ ] Service deployed successfully
- [ ] Health check passes (`/` endpoint returns 200)
- [ ] Database seeded via Shell

### Frontend (Netlify) Checklist
- [ ] Netlify site created from Git repository
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`
- [ ] `VITE_API_URL` environment variable set to backend API URL
- [ ] Site deployed successfully
- [ ] Frontend loads without console errors
- [ ] API calls succeed (check browser DevTools Network tab)

### Post-Deployment Testing
- [ ] Visit frontend URL, verify page loads
- [ ] Register new user account
- [ ] Login with seeded credentials (admin@fleetpro.com/admin123)
- [ ] Test dashboard loads with data
- [ ] Create maintenance request
- [ ] Update inventory quantity
- [ ] Submit and approve requisition (as Admin)
- [ ] Verify role-based access control

---

## 🔧 Troubleshooting Common Issues

### Backend Won't Start on Render
**Symptoms:** Build succeeds but service fails to start
**Solutions:**
1. Check Render logs for error messages
2. Verify `package.json` has correct `start` script
3. Ensure `dist/index.js` exists after build
4. Check Node.js version compatibility

### Database Connection Issues
**Symptoms:** API returns database errors
**Solutions:**
1. Verify `DATABASE_URL` environment variable
2. Check Prisma client generation in build logs
3. For Supabase: verify connection string format and network access

### Frontend Can't Connect to Backend
**Symptoms:** CORS errors or network failures
**Solutions:**
1. Verify `VITE_API_URL` points to correct backend URL
2. Check backend CORS configuration
3. Test backend URL directly in browser
4. Verify no ad-blockers interfering

### SQLite Database Resets
**Symptoms:** Data disappears after Render restart
**Solutions:**
1. Switch to Supabase PostgreSQL (recommended)
2. Implement automatic re-seeding on startup
3. Use Render's paid tier with persistent storage

---

## 🚀 Advanced Deployment Options

### Custom Domain Setup
1. **Netlify:** Site settings → Domain management → Add custom domain
2. **Render:** Service settings → Custom domains → Add domain
3. **DNS Configuration:** Update DNS records as instructed

### CI/CD Pipeline
1. **Automatic Deployments:** Both Netlify and Render deploy on Git push
2. **Preview Deployments:** Netlify creates previews for PRs
3. **Rollbacks:** Both platforms support rollback to previous versions

### Monitoring & Analytics
1. **Render Metrics:** CPU, memory, request metrics in dashboard
2. **Netlify Analytics:** Traffic and performance insights
3. **Custom Logging:** Implement Winston or Morgan for detailed logs

### Security Enhancements
1. **HTTPS:** Automatic SSL certificates from both platforms
2. **Security Headers:** Configure in `netlify.toml`
3. **Rate Limiting:** Implement express-rate-limit for API protection
4. **Input Validation:** Already implemented with Zod schemas

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [React Deployment Best Practices](https://create-react-app.dev/docs/deployment/)

---

**Need Help?**
1. Check application logs in Render/Netlify dashboards
2. Review error messages in browser console
3. Test API endpoints directly with curl or Postman
4. Consult the comprehensive documentation in `/documentation/` folder

**For University Project Submission:**
- Include both frontend and backend URLs in submission
- Provide test credentials (admin@fleetpro.com/admin123)
- Document any known issues or limitations
- Include screenshots of working functionality
