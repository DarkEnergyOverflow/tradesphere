# TradeSphere - Vercel Deployment Guide

## Prerequisites
1. A Vercel account (sign up at https://vercel.com)
2. A PostgreSQL database (recommended: Vercel Postgres, Neon, or Supabase)
3. Your Finnhub API key

## Step-by-Step Deployment

### 1. Prepare Your Database

#### Option A: Vercel Postgres (Recommended)
1. Go to your Vercel dashboard
2. Create a new Postgres database
3. Copy the `DATABASE_URL` connection string

#### Option B: Neon (Free Tier Available)
1. Sign up at https://neon.tech
2. Create a new project
3. Copy the connection string

#### Option C: Supabase
1. Sign up at https://supabase.com
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string (use "Connection pooling" for better performance)

### 2. Deploy to Vercel

#### Method 1: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? tradesphere (or your preferred name)
# - Directory? ./
# - Override settings? No
```

#### Method 2: Using Vercel Dashboard

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to https://vercel.com/new
3. Import your repository
4. Vercel will auto-detect Next.js settings
5. Click "Deploy"

### 3. Configure Environment Variables

In your Vercel project dashboard, go to **Settings > Environment Variables** and add:

```
DATABASE_URL=your_postgres_connection_string
NEXTAUTH_SECRET=your_random_secret_key_here
NEXTAUTH_URL=https://your-app-name.vercel.app
FINNHUB_API_KEY=d7hjqjhr01qhiu0bssb0d7hjqjhr01qhiu0bssbg
```

**Important Notes:**
- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXTAUTH_SECRET`: Generate a secure random string (use: `openssl rand -base64 32`)
- `NEXTAUTH_URL`: Your Vercel deployment URL (update after first deployment)
- `FINNHUB_API_KEY`: Your Finnhub API key

### 4. Run Database Migrations

After deployment, you need to run Prisma migrations:

```bash
# Option 1: Using Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy

# Option 2: Using Prisma Studio (if you have direct DB access)
npx prisma db push
```

**Alternative: Automatic Migration on Build**

The project is already configured to run `prisma generate` during build. For migrations, you can:

1. Run migrations locally against production DB:
```bash
DATABASE_URL="your_production_db_url" npx prisma migrate deploy
```

2. Or use Prisma Studio to push schema:
```bash
DATABASE_URL="your_production_db_url" npx prisma db push
```

### 5. Verify Deployment

1. Visit your Vercel URL
2. Try signing up for a new account
3. Test stock browsing and trading features
4. Check the Vercel logs for any errors

## Post-Deployment Configuration

### Custom Domain (Optional)
1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update `NEXTAUTH_URL` environment variable to your custom domain

### Database Connection Pooling (Recommended)

For better performance with serverless functions:

1. Use connection pooling URL from your database provider
2. Update `DATABASE_URL` to use the pooling connection string
3. Add to `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // Optional: for migrations
}
```

### Monitoring

1. **Vercel Analytics**: Enable in project settings
2. **Error Tracking**: Consider adding Sentry
3. **Database Monitoring**: Use your database provider's dashboard

## Troubleshooting

### Build Errors

**Error: Prisma Client not generated**
```bash
# Add to package.json scripts
"postinstall": "prisma generate"
```

**Error: Database connection failed**
- Verify `DATABASE_URL` is correct
- Check if database allows connections from Vercel IPs
- Ensure SSL is enabled (add `?sslmode=require` to connection string)

### Runtime Errors

**Error: NEXTAUTH_URL not set**
- Add `NEXTAUTH_URL` environment variable in Vercel dashboard
- Redeploy the application

**Error: API rate limit exceeded (Finnhub)**
- Finnhub free tier has 60 calls/minute limit
- Consider implementing caching or upgrading plan

### Database Migration Issues

**Error: Migration failed**
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or push schema without migrations
npx prisma db push
```

## Performance Optimization

### 1. Enable Edge Runtime (Optional)
For faster response times, you can enable Edge runtime for API routes:

```typescript
// In API route files
export const runtime = 'edge';
```

### 2. Add Caching
Implement Redis caching for stock prices to reduce API calls:
- Use Vercel KV or Upstash Redis
- Cache stock prices for 1-5 minutes

### 3. Optimize Images
- Use Next.js Image component
- Enable Vercel Image Optimization

## Security Checklist

- ✅ Environment variables are set in Vercel (not in code)
- ✅ Database connection uses SSL
- ✅ NEXTAUTH_SECRET is a strong random string
- ✅ API routes are protected with authentication
- ✅ CORS is properly configured
- ✅ Rate limiting is implemented (consider adding)

## Useful Commands

```bash
# View deployment logs
vercel logs

# Pull environment variables locally
vercel env pull

# Redeploy
vercel --prod

# Open project in browser
vercel open
```

## Support Resources

- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Prisma Documentation: https://www.prisma.io/docs
- Finnhub API Docs: https://finnhub.io/docs/api

## Cost Estimation

### Free Tier Includes:
- Vercel: Unlimited deployments, 100GB bandwidth
- Neon: 0.5GB storage, 3GB data transfer
- Finnhub: 60 API calls/minute

### Paid Plans (if needed):
- Vercel Pro: $20/month (more bandwidth, analytics)
- Neon Pro: $19/month (more storage, compute)
- Finnhub: $9.99/month (higher rate limits)

## Next Steps After Deployment

1. Test all features thoroughly
2. Set up monitoring and alerts
3. Configure custom domain (optional)
4. Add more Indian stocks support (consider different API)
5. Implement caching for better performance
6. Add rate limiting for API protection
7. Set up automated backups for database

---

**Need Help?**
- Vercel Support: https://vercel.com/support
- GitHub Issues: Create an issue in your repository
