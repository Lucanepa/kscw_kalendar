# 🚀 Supabase Edge Function Setup Guide

This guide will help you deploy a CORS-free calendar proxy using Supabase Edge Functions.

## 📋 Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com) (free tier is sufficient)
2. **Supabase CLI**: Install the Supabase CLI

## 🛠️ Installation Steps

### 1. Install Supabase CLI

**Windows (via npm):**
```bash
npm install -g supabase
```

**macOS (via Homebrew):**
```bash
brew install supabase/tap/supabase
```

### 2. Create Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose organization and enter:
   - **Name**: `kscw-calendar`
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to you (e.g., Europe West for Switzerland)
4. Wait for project creation (2-3 minutes)

### 3. Get Your Project Details

After project is created, note down:
- **Project URL**: `https://[your-project-ref].supabase.co`
- **Project Reference**: The unique ID in your project URL

### 4. Login to Supabase CLI

```bash
supabase login
```

### 5. Link Your Local Project

In your project directory, run:
```bash
supabase link --project-ref [your-project-ref]
```

### 6. Deploy Edge Function

```bash
supabase functions deploy calendar-proxy
```

### 7. Update Calendar HTML

In your `index.html`, replace:
```javascript
const supabaseUrl = 'YOUR_SUPABASE_URL';
```

With your actual Supabase URL:
```javascript
const supabaseUrl = 'https://[your-project-ref].supabase.co';
```

## 🧪 Testing

### Test the Edge Function

You can test your Edge Function directly:
```bash
curl https://[your-project-ref].supabase.co/functions/v1/calendar-proxy
```

You should see your calendar data in iCal format.

### Test the Calendar

1. Update your `index.html` with the correct Supabase URL
2. Open the calendar in your browser
3. Check browser console for successful fetch messages

## 🔧 Troubleshooting

### Function Not Found (404)
- Ensure you deployed: `supabase functions deploy calendar-proxy`
- Check function name matches in URL

### CORS Errors
- The Edge Function handles CORS automatically
- No additional configuration needed

### Calendar Data Not Loading
- Check browser console for errors
- Verify your Supabase URL is correct
- Test the Edge Function URL directly

## 💰 Cost

- **Supabase Free Tier**: 500K Edge Function invocations/month
- **Calendar fetches**: ~1 call per page load
- **Estimated usage**: Well within free tier for normal use

## 🔄 Alternative: One-Click Deploy

If you prefer, you can also:

1. Fork this repository
2. Connect it to Vercel/Netlify
3. Add Supabase project as environment variables
4. Auto-deploy on commits

## 📞 Support

If you encounter issues:
1. Check the Supabase dashboard logs
2. Review browser console errors
3. Test Edge Function URL directly

Your calendar will now be **completely CORS-free** and much more reliable! 🎉