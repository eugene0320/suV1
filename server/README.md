# ElevenLabs Post-Call Webhook Server

This server receives post-call webhooks from ElevenLabs after conversations end and stores the conversation data in your Supabase database.

## Why Use This Webhook?

This webhook solves the issue where conversation data wasn't being properly stored in Supabase tables during calls. ElevenLabs sends detailed post-call data to this webhook, ensuring you capture all conversation details even if real-time capture fails.

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the server directory by copying the example:

```bash
cp .env.example .env
```

Then edit the `.env` file with your actual credentials:
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`: Copy from your frontend `.env` file
- `WEBHOOK_SECRET`: You'll get this when setting up the webhook in ElevenLabs dashboard

### 3. Start the Webhook Server

For development:
```bash
npm run dev
```

For production:
```bash
npm start
```

## Make the Server Publicly Accessible

ElevenLabs needs a public URL to send webhook data to. For development, you can use ngrok:

```bash
# Install ngrok if you haven't already
npm install -g ngrok

# Expose your local server
ngrok http 3001
```

Ngrok will provide a public URL (e.g., `https://abc123.ngrok.io`) that forwards to your local server.

## Configure the Webhook in ElevenLabs

1. Log in to your [ElevenLabs dashboard](https://elevenlabs.io/app/conversational-ai/settings)
2. Navigate to the Conversational AI settings
3. Add a new Post-call Webhook:
   - Set the URL to your public endpoint (e.g., `https://abc123.ngrok.io/webhook/elevenlabs` or your production URL)
   - Enable HMAC authentication and copy the secret to your `.env` file

## Production Deployment

For production, deploy this server to a hosting platform like:

- [Render](https://render.com/)
- [Railway](https://railway.app/)
- [Heroku](https://www.heroku.com/)
- [Digital Ocean](https://www.digitalocean.com/)

Set the environment variables on your hosting platform to match your local `.env` file.

## Passing User IDs to ElevenLabs

To associate conversations with specific users, modify your ElevenLabs widget to include a user ID in the dynamic variables:

```html
<elevenlabs-convai
  agent-id="your-agent-id"
  dynamic-variables='{"user_id": "USER_ID_HERE"}'
></elevenlabs-convai>
```

This `user_id` will be extracted from the webhook data and stored in Supabase.

## Troubleshooting

- **401 Unauthorized**: Verify your webhook secret is correct
- **Webhook not receiving data**: Ensure the webhook URL is accessible and ElevenLabs can reach it
- **Database errors**: Check your Supabase credentials and table structure

## Supabase Schema Requirements

The webhook expects these tables in your Supabase database:

### `conversations` table
- `conversation_id` (text, primary key)
- `user_id` (text, nullable)
- `transcript` (json, nullable)
- `end_time` (timestamp)
- `analysis_summary` (text, nullable)
- `call_duration` (integer, nullable)

### `conversation_logs` table
- `id` (auto-incrementing integer, primary key)
- `conversation_id` (text)
- `user_id` (text, nullable)
- `speaker` (text)
- `message` (text)
- `timestamp` (timestamp)
