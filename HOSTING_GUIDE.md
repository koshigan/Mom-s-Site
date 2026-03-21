# RSK Tailoring - Hosting Guide

## 🚀 Deployment Options

### Option 1: Railway (Recommended - Free Tier Available)
Railway is perfect for full-stack apps with databases.

#### Steps:
1. **Sign up**: https://railway.app
2. **Connect GitHub**: Push your code to GitHub first
3. **Deploy Backend**:
   - Create new project → Deploy from GitHub
   - Select backend folder
   - Add environment variables from `.env`
   - Railway auto-detects Node.js
4. **Deploy Frontend**:
   - Create new project → Deploy from GitHub
   - Select frontend folder
   - Set build command: `npm run build`
   - Set publish directory: `build`

#### Database Setup:
Railway provides PostgreSQL for free. You'll need to migrate from SQLite.

### Option 2: Vercel + Railway
Best for frontend, combine with Railway for backend.

#### Frontend on Vercel:
1. **Sign up**: https://vercel.com
2. **Deploy**: Connect GitHub, select frontend folder
3. **Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Add environment variable: `REACT_APP_API_URL=https://your-backend-url.railway.app`

#### Backend on Railway:
Same as Option 1.

### Option 3: Render (Free Tier)
Good alternative to Railway.

#### Steps:
1. **Sign up**: https://render.com
2. **Deploy Backend**:
   - New → Web Service → Connect GitHub
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
3. **Deploy Frontend**:
   - New → Static Site → Connect GitHub
   - Build Command: `npm run build`
   - Publish Directory: `build`

### Option 4: DigitalOcean App Platform
Professional hosting with free tier.

#### Steps:
1. **Sign up**: https://digitalocean.com
2. **Create App**: Connect GitHub
3. **Configure**:
   - Frontend: Static Site, build command `npm run build`
   - Backend: Web Service, start command `npm start`

## 🗄️ Database Migration (Required)

SQLite won't work on most hosting platforms. Migrate to PostgreSQL:

### Using Railway PostgreSQL:
1. Railway provides free PostgreSQL
2. Update `db.js` to use PostgreSQL instead of SQLite
3. Update connection string in environment variables

### Migration Script:
```javascript
// Add to package.json dependencies:
// "pg": "^8.11.0"

const { Client } = require('pg');
const sqlite3 = require('sqlite3').verbose;

// Connect to SQLite and PostgreSQL
// Export data and import to PostgreSQL
```

## 🔧 Production Configuration

### Environment Variables:
```
NODE_ENV=production
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=https://your-frontend-domain.com
PORT=10000
```

### CORS Configuration:
Update `server.js`:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

## 📁 Project Structure for Deployment

```
your-repo/
├── frontend/     # React app
│   ├── build/    # Production build (generated)
│   └── package.json
├── backend/      # Express API
│   ├── server.js
│   ├── package.json
│   └── .env
└── README.md
```

## 🌐 Custom Domain (Optional)

1. **Vercel**: Settings → Domains → Add your domain
2. **Railway**: Settings → Domains → Custom domain
3. **Render**: Settings → Custom domain

## 💰 Cost Comparison

| Platform | Free Tier | Paid Plans |
|----------|-----------|------------|
| Railway | 512MB RAM, 1GB storage | $5/month |
| Render | 750 hours/month | $7/month |
| Vercel | 100GB bandwidth | $20/month |
| DigitalOcean | None | $12/month |

## 🚀 Quick Deploy (Railway)

1. **Push to GitHub**
2. **Railway Backend**:
   ```bash
   # Railway will auto-deploy
   # Add env vars in Railway dashboard
   ```
3. **Railway Frontend**:
   ```bash
   # Set build command: npm run build
   # Set root directory: frontend
   ```

Your site will be live at `https://your-app.railway.app`!