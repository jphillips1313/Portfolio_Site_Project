# SMTP Configuration for Contact Form

The contact form now sends emails directly through your backend. To enable this, you need to configure SMTP settings.

## Required Environment Variables

Add these to your `backend/.env` file:

```env
# SMTP Configuration (for contact form emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
RECIPIENT_EMAIL=jackphillips1313@gmail.com
```

## Gmail Setup (Recommended)

If using Gmail:

1. **Enable 2-Factor Authentication**

   - Go to your Google Account settings
   - Security → 2-Step Verification → Turn on

2. **Generate App Password**

   - Visit: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password

3. **Add to .env**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=jackphillips1313@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx  # Your app password
   RECIPIENT_EMAIL=jackphillips1313@gmail.com
   ```

## Alternative SMTP Providers

### SendGrid

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### AWS SES

```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-aws-access-key
SMTP_PASS=your-aws-secret-key
```

### Mailgun

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your-mailgun-password
```

## Testing

After configuring SMTP:

1. Restart your backend:

   ```bash
   docker-compose restart backend
   ```

2. Visit `http://localhost:3000/contact`

3. Fill out and submit the form

4. Check your inbox for the email!

## Fallback (No SMTP)

If SMTP is not configured, the form will still work but emails won't be sent. The backend will log the submission to console instead.
