# Firebase Production Setup Checklist

## To make Firebase OTP work in production, follow these steps:

### 1. Firebase Console Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `mern-auth-12b18`
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add your production domains:
   - `localhost` (for development)
   - Your production domain (e.g., `yourapp.vercel.app`)
   - Any other domains where your app will be hosted

### 2. reCAPTCHA Configuration
1. In Firebase Console → **Authentication** → **Sign-in method**
2. Enable **Phone** authentication
3. Configure reCAPTCHA settings
4. Ensure your production domain is added to authorized domains

### 3. Environment Variables
Make sure you have a `.env` file in your client folder with:
```
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
```

### 4. Testing
- **Development**: Uses TEST_MODE (simulated OTP: 123456)
- **Production**: Uses real Firebase OTP via SMS

### 5. Important Notes
- Phone verification will work automatically in production
- Users will receive real SMS in production
- The system automatically syncs verification status between booking and profile pages
- reCAPTCHA will be visible in production (invisible in test mode)

## Current Status: ✅ Ready for Production
Your Firebase setup is complete and will work when hosted!
