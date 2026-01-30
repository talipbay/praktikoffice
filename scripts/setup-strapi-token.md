# How to Fix the 401 Error - Strapi API Token

## The Problem

You're getting "Strapi API error: 401" because the API token is not set correctly.

## Solution: Make API Public (Quick Fix)

### Step 1: Open Strapi Admin

Go to: `http://localhost:1337/admin`

### Step 2: Configure Public Permissions

1. Click **"Settings"** in the left sidebar
2. Click **"Users & Permissions Plugin"** → **"Roles"**
3. Click on **"Public"** role
4. Scroll down and find these content types:
   - **Office**
   - **Meeting-room**
   - **Coworking-tariff**
   - **Gallery-category** (if you have it)
5. For each content type, check these permissions:
   - ✅ `find` (get all entries)
   - ✅ `findOne` (get single entry)
6. Click **"Save"** at the top right

### Step 3: Remove API Token Requirement

Edit `.env.local` and comment out the token:

```bash
# Strapi Configuration
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
# NEXT_PUBLIC_STRAPI_API_TOKEN=your_strapi_api_token_here
```

### Step 4: Rebuild and Restart

```bash
./scripts/fix-cache-issue.sh
```

---

## Alternative: Generate API Token (More Secure)

If you want to keep the API private and use a token:

### Step 1: Generate Token in Strapi

1. Go to: `http://localhost:1337/admin`
2. Click **"Settings"** in the left sidebar
3. Click **"API Tokens"** under "Global Settings"
4. Click **"Create new API Token"**
5. Fill in:
   - **Name**: "Next.js Frontend"
   - **Token duration**: "Unlimited"
   - **Token type**: "Read-only" or "Full access"
6. Click **"Save"**
7. **Copy the token** (you won't see it again!)

### Step 2: Add Token to .env.local

```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_TOKEN=paste_your_token_here
```

### Step 3: Rebuild and Restart

```bash
./scripts/fix-cache-issue.sh
```

---

## Which Option to Choose?

**Option 1: Public API** (Recommended for now)
- ✅ Easier to set up
- ✅ No token management
- ⚠️ Anyone can read your data (but that's okay for a public website)

**Option 2: API Token** (For production)
- ✅ More secure
- ✅ Better control
- ⚠️ Need to manage tokens

For a public website showing offices and meeting rooms, **Option 1 (Public API)** is perfectly fine!

---

## Quick Test

After making changes, test the API:

```bash
# Without token (public API)
curl http://localhost:1337/api/offices?populate=*

# With token
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:1337/api/offices?populate=*
```

Should return JSON with your offices (not 401 error).
