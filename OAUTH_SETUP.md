# OAuth Setup Guide for TradeX

This guide will help you configure Google OAuth for TradeX ZKLogin authentication.

## 🚨 Important Note

The current implementation includes client secrets in the frontend for **development/demo purposes only**.

**⚠️ For production apps:**

- OAuth token exchange should be handled by a backend service
- Client secrets should NEVER be exposed in frontend code
- Consider using OAuth 2.0 PKCE flow for public clients

## 🔧 Environment Variables

Create a `.env.local` file in the TradeX root directory:

```env
# Google OAuth 2.0
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## 🔵 Google OAuth Setup

1. **Go to Google Cloud Console**

   - Visit [console.cloud.google.com](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable APIs**

   - Go to "APIs & Services" → "Library"
   - Search for and enable "Google+ API" or "People API"

3. **Create OAuth Credentials**

   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application"

4. **Configure OAuth Application**

   ```
   Application type: Web application
   Name: TradeX

   Authorized JavaScript origins:
   - http://localhost:5173
   - http://localhost:3000
   - https://yourdomain.com (for production)

   Authorized redirect URIs:
   - http://localhost:5173/callback
   - http://localhost:3000/callback
   - https://yourdomain.com/callback (for production)
   ```

5. **Download Credentials**
   - Copy the Client ID and Client Secret
   - Add them to your `.env.local` file

## 🔍 Troubleshooting

### "client_secret is missing" Error

This error occurs when:

1. **Missing environment variable**: Add `VITE_GOOGLE_CLIENT_SECRET` to `.env.local`
2. **OAuth app misconfiguration**: Your OAuth app is configured as "confidential" instead of "public"

**Solutions:**

1. **Add client secret** (quick fix for development):

   ```env
   VITE_GOOGLE_CLIENT_SECRET=your_actual_client_secret
   ```

2. **Configure as public client** (recommended for frontend apps):
   - In Google Cloud Console, edit your OAuth client
   - Under "Application type", ensure it's set correctly
   - Some configurations don't require client_secret for public clients

### "redirect_uri_mismatch" Error

- Ensure your redirect URI exactly matches what's configured in OAuth console
- Check for trailing slashes, http vs https, port numbers

### CORS Errors

- Make sure your domain is added to "Authorized JavaScript origins"
- For development, include `http://localhost:5173`

## 🚀 Testing

1. **Start the development server**:

   ```bash
   npm run dev
   ```

2. **Try OAuth login**:

   - Go to `/signup` or `/login`
   - Click "Sign in with Google"
   - Check browser console for detailed logs

3. **Verify JWT**:
   - Successful login should log "Received real JWT from OAuth provider"
   - Check the decoded JWT contains real user data (not "Test User")

## 📖 Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)

- [OAuth 2.0 Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
