# AICFO Deployment Guide

## 🚀 Quick Start (Local Development)

### Prerequisites
```bash
# Check versions
node --version  # Should be 20+
npm --version   # Should be 10+
```

### Step 1: Install Dependencies
```bash
cd aicfo
npm install
```

### Step 2: Set Up Supabase (Free Tier)

1. **Create Account**: Go to [supabase.com](https://supabase.com)
2. **New Project**:
   - Name: `aicfo-dev`
   - Database Password: (save this!)
   - Region: Choose closest to you
   
3. **Get Credentials**:
   ```
   Settings → API
   - Project URL: https://xxxxx.supabase.co
   - anon/public key: eyJhbGc...
   - service_role key: eyJhbGc... (keep secret!)
   ```

4. **Connection String**:
   ```
   Settings → Database → Connection String
   - Copy "URI" format
   ```

### Step 3: Configure Environment
```bash
# Copy example
cp .env.example .env

# Edit .env
nano .env
```

Fill in:
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGc..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGc..."
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
SEC_USER_AGENT="AICFO support@aicfo.com"
```

### Step 4: Initialize Database
```bash
# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### Step 5: Run Development Server
```bash
npm run dev
```

Visit: `http://localhost:3000`

---

## 🌐 Production Deployment (Vercel)

### Prerequisites
- Vercel account (free)
- GitHub repository
- Supabase production project

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - AICFO v0.1.0"
git remote add origin https://github.com/yourusername/aicfo.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. **Import Project**:
   - Go to [vercel.com](https://vercel.com)
   - New Project → Import from GitHub
   - Select `aicfo` repository

2. **Configure Environment Variables**:
   ```
   DATABASE_URL
   DIRECT_URL
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   NEXTAUTH_URL (your vercel domain)
   NEXTAUTH_SECRET
   SEC_USER_AGENT
   ```

3. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app is live at: `https://aicfo.vercel.app`

### Step 3: Custom Domain (Optional)
```
Vercel Dashboard → Settings → Domains
Add: aicfo.com

Then in your domain registrar:
- A record: 76.76.21.21
- CNAME: cname.vercel-dns.com
```

---

## 📊 Database Management

### View Database
```bash
npx prisma studio
```

### Run Migrations
```bash
npx prisma migrate dev --name add_new_feature
```

### Reset Database (Danger!)
```bash
npx prisma migrate reset
```

### Backup Database
```bash
# From Supabase Dashboard
Database → Backups → Download
```

---

## 🧪 Testing

### Test SEC API
```bash
# Create test file
cat > test-sec.js << 'EOF'
const { searchPublicCompany, fetchCompanyFinancials } = require('./src/lib/sec-edgar/api-client');

async function test() {
  console.log('Searching for Apple...');
  const results = await searchPublicCompany('Apple');
  console.log(results[0]);
  
  console.log('\nFetching financials...');
  const financials = await fetchCompanyFinancials(results[0].cik);
  console.log('Success!', financials.entityName);
}

test();
EOF

node test-sec.js
```

Expected output:
```
Searching for Apple...
{ cik: '0000320193', name: 'Apple Inc.', ticker: 'AAPL', ... }

Fetching financials...
Success! Apple Inc.
```

---

## 🔒 Security Checklist

### Before Launch
- [ ] Change all default passwords
- [ ] Set strong NEXTAUTH_SECRET
- [ ] Enable Supabase RLS policies
- [ ] Add rate limiting
- [ ] Set up CORS properly
- [ ] Enable HTTPS only
- [ ] Review environment variables

### Production
- [ ] Enable Vercel Analytics
- [ ] Set up Sentry error tracking
- [ ] Configure backup schedule
- [ ] Add monitoring alerts
- [ ] Document incident response

---

## 🐛 Troubleshooting

### Error: "Prisma Client not generated"
```bash
npx prisma generate
```

### Error: "Database connection failed"
```bash
# Check connection string format
# Should start with postgresql://
# Check firewall rules in Supabase
```

### Error: "Module not found"
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json .next
npm install
```

### Error: "SEC API 403 Forbidden"
```bash
# Check User-Agent header
# SEC requires: "CompanyName contact@email.com"
```

---

## 📈 Monitoring

### Vercel Analytics
```
Dashboard → Analytics
- Page views
- Response times
- Error rates
```

### Supabase Monitoring
```
Dashboard → Reports
- Database size
- Active connections
- Query performance
```

### Custom Logging
```typescript
// In your code
console.log('[AICFO]', {
  event: 'company_added',
  company_id: id,
  timestamp: new Date()
});
```

---

## 🔄 Updates & Maintenance

### Update Dependencies
```bash
npm update
npm audit fix
```

### Update Next.js
```bash
npm install next@latest react@latest react-dom@latest
```

### Database Migration
```bash
# 1. Modify prisma/schema.prisma
# 2. Create migration
npx prisma migrate dev --name add_new_field
# 3. Push to production
npx prisma migrate deploy
```

---

## 💾 Backup Strategy

### Daily Automatic Backups
- Supabase handles this automatically
- Retention: 7 days (Free tier)

### Manual Backup Before Major Changes
```bash
# Export schema
npx prisma db pull

# Export data (requires pg_dump)
pg_dump $DATABASE_URL > backup.sql
```

---

## 📞 Support

### Issues
- GitHub Issues: `github.com/yourusername/aicfo/issues`
- Email: support@aicfo.com

### Documentation
- Prisma: https://www.prisma.io/docs
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Vercel: https://vercel.com/docs

---

**Last Updated**: January 18, 2026
