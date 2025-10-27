# Deployment Guide for Chip Happens Cookie App

## Prerequisites

- GitHub account
- Stripe account (get your live API keys)
- Hosting platform account (Vercel, Netlify, or Render)

---

## Part 1: Deploy the Stripe Server (Backend)

### Option A: Deploy to Render (Recommended - Free & Easy)

1. **Go to [Render.com](https://render.com) and sign up**

2. **Create a New Web Service**

   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Or use "Public Git repository" and paste your repo URL

3. **Configure the service:**

   - **Name:** `chip-happens-stripe-server`
   - **Region:** Choose closest to your users
   - **Branch:** `main` (or your default branch)
   - **Root Directory:** Leave empty or set to `server`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node stripe-server.js` (or `node ../stripe-server.js` if in server folder)
   - **Plan:** Free

4. **Add Environment Variables:**

   - Click "Environment" tab
   - Add these variables:
     ```
     STRIPE_SECRET_KEY = sk_live_YOUR_LIVE_KEY_HERE
     FRONTEND_URL = https://your-app.netlify.app
     PORT = 4242
     ```

5. **Deploy!**
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)
   - Copy your Render URL (e.g., `https://chip-happens-stripe-server.onrender.com`)

### Option B: Deploy to Vercel

1. **Install Vercel CLI:**

   ```bash
   npm install -g vercel
   ```

2. **Deploy:**

   ```bash
   cd server
   vercel deploy --prod
   ```

3. **Add Environment Variables in Vercel Dashboard:**
   - Go to your project settings
   - Add `STRIPE_SECRET_KEY` and `FRONTEND_URL`

---

## Part 2: Deploy the Frontend (Ionic/React App)

### Option A: Deploy to Netlify (Recommended for Ionic)

1. **Build your app:**

   ```bash
   npm run build
   ```

2. **Go to [Netlify.com](https://netlify.com) and sign up**

3. **Deploy:**

   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repo
   - **Build command:** `npm run build`
   - **Publish directory:** `dist` (or `build`)
   - Click "Deploy"

4. **Add Environment Variable:**

   - Go to Site settings → Environment variables
   - Add:
     ```
     REACT_APP_STRIPE_API_URL = https://your-stripe-server.onrender.com
     ```

5. **Redeploy:**

   - Go to Deploys → Trigger deploy

6. **Copy your Netlify URL** (e.g., `https://chip-happens.netlify.app`)

### Option B: Deploy to Vercel

```bash
npm run build
vercel deploy --prod
```

---

## Part 3: Update Configuration

### Update Backend with Frontend URL

1. **Go back to Render (or Vercel)**
2. **Update `FRONTEND_URL` environment variable:**
   ```
   FRONTEND_URL = https://chip-happens.netlify.app
   ```
3. **Redeploy the backend**

### Update Frontend with Backend URL

1. **In your local project, update `.env.production`:**

   ```
   REACT_APP_STRIPE_API_URL=https://your-stripe-server.onrender.com
   ```

2. **Redeploy frontend** (push to GitHub or use CLI)

---

## Part 4: Configure Stripe

1. **Get your Live API Keys:**

   - Go to [Stripe Dashboard](https://dashboard.stripe.com)
   - Click "Developers" → "API keys"
   - Copy your **Live Secret Key** (starts with `sk_live_`)
   - Copy your **Live Publishable Key** (starts with `pk_live_`)

2. **Update Backend Environment Variable:**

   - In Render dashboard, update:
     ```
     STRIPE_SECRET_KEY = sk_live_YOUR_ACTUAL_LIVE_KEY
     ```

3. **Test the payment flow:**
   - Use real card details (in live mode)
   - Or use Stripe test cards in test mode

---

## Testing Checklist

- [ ] Frontend loads correctly
- [ ] Backend responds to health check
- [ ] Can add items to cart
- [ ] Checkout page loads
- [ ] Stripe checkout redirects properly
- [ ] Payment succeeds and redirects to order confirmation
- [ ] Order appears in profile/orders
- [ ] Cash on Delivery works

---

## Important Notes

### Security

- ✅ Never commit `.env` files to Git
- ✅ Use environment variables for all secrets
- ✅ Use HTTPS for production (Netlify/Vercel provide this)
- ✅ Keep your Stripe secret keys private

### Costs

- **Render Free Tier:** Server may sleep after 15 min of inactivity (wakes up in ~30 seconds)
- **Netlify Free Tier:** 100GB bandwidth/month
- **Vercel Free Tier:** Good for hobby projects
- **Stripe:** 2.9% + ₱15 per successful transaction

### Monitoring

- Check Render logs for backend errors
- Check Netlify deploy logs for frontend issues
- Monitor Stripe dashboard for payment issues

---

## Troubleshooting

### Backend not responding

- Check Render logs
- Verify environment variables are set
- Ensure `stripe-server.js` is in the correct location

### Payment redirect fails

- Verify `FRONTEND_URL` in backend matches your actual frontend URL
- Check Stripe dashboard for webhook errors
- Ensure success/cancel URLs are correct

### CORS errors

- Backend `cors()` middleware should allow your frontend domain
- Update cors configuration if needed

---

## Next Steps After Deployment

1. **Test thoroughly** with real payment methods
2. **Set up domain name** (optional)
3. **Enable Stripe webhooks** for payment confirmations
4. **Add SSL certificate** (auto with Netlify/Vercel)
5. **Monitor logs** for any errors

---

## Useful Commands

```bash
# Test backend locally
cd server
npm install
node ../stripe-server.js

# Test frontend locally
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel deploy --prod

# View Render logs
# Go to Render dashboard → Your service → Logs
```

---

## Support

- Stripe Documentation: https://stripe.com/docs
- Render Documentation: https://render.com/docs
- Netlify Documentation: https://docs.netlify.com
- Vercel Documentation: https://vercel.com/docs

Good luck with your deployment! 🚀🍪
