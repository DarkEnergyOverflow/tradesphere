# 🚀 TradeSphere Setup Instructions

## Quick Setup (5 minutes)

### Step 1: Run Setup Script

```bash
./setup-database.sh
```

This interactive script will:
- Ask for your Supabase project URL
- Open the SQL Editor
- Guide you through creating tables

### Step 2: Create Database Tables

**Option A: Supabase SQL Editor (Easiest)**

1. The script will open: https://supabase.com/dashboard
2. Go to your project → SQL Editor
3. Click "New Query"
4. Copy all SQL from `scripts/schema.sql`
5. Paste and click "Run"
6. Verify in Table Editor: You should see `User`, `Portfolio`, `Transaction` tables

**Option B: Using Prisma**

1. Get connection string from Supabase Dashboard → Settings → Database
2. Update `.env.local`:
   ```env
   DATABASE_URL="your_connection_string?pgbouncer=true"
   ```
3. Run:
   ```bash
   npx prisma db push
   ```

### Step 3: Update Environment Variables

Edit `.env.local` with your actual values:

```env
# Get from Supabase Dashboard → Settings → Database
DATABASE_URL="postgresql://postgres.xxxxx:password@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Get from Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGc..."
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"
FINNHUB_API_KEY="d7hjqjhr01qhiu0bssb0d7hjqjhr01qhiu0bssbg"
```

### Step 4: Install and Run

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Start development server
npm run dev
```

Visit: http://localhost:3000

## 🎯 Your Credentials

- **Supabase Service Key**: Get from Supabase Dashboard → Settings → API
- **Finnhub API Key**: `d7hjqjhr01qhiu0bssb0d7hjqjhr01qhiu0bssbg`

## 📋 What You Need from Supabase Dashboard

1. **Project URL**: https://xxxxx.supabase.co
2. **Database Password**: Settings → Database → Reset if needed
3. **Connection String**: Settings → Database → Connection pooling
4. **Anon Key**: Settings → API → Project API keys

## 🔧 Troubleshooting

### "Connection refused"
- Enable "Allow all IP addresses" in Supabase Dashboard → Settings → Database

### "Password authentication failed"
- Reset password: Settings → Database → Reset database password
- Update connection string with new password

### "Tables not found"
- Make sure you ran the SQL in Step 2
- Check Table Editor to verify tables exist

## 📚 Documentation

- **SUPABASE_QUICK_START.md** - Quick reference guide
- **SUPABASE_SETUP.md** - Detailed setup instructions
- **DEPLOYMENT.md** - Vercel deployment guide

## 🚀 Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Then redeploy
```

## ✅ Verification Checklist

- [ ] Database tables created (User, Portfolio, Transaction)
- [ ] .env.local updated with connection string
- [ ] npm install completed
- [ ] npx prisma generate completed
- [ ] App runs on http://localhost:3000
- [ ] Can create account and sign in
- [ ] Can view stocks and make trades

## 🆘 Need Help?

1. Check documentation files
2. View SQL schema: `cat scripts/schema.sql`
3. Run setup script again: `./setup-database.sh`
4. Check Supabase logs in dashboard

---

**Ready to start?** Run: `./setup-database.sh`
