import type { VercelRequest, VercelResponse } from '@vercel/node'
import fetch from 'node-fetch' // make sure to install node-fetch

// Hardcoded Discord webhook URL
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1467553434541625558/fKl1f66ykkbYUxlzxhR-ODuDaskO6bZvEi_Xb7zxeR0MNelnYg3LJBs-ZFCmA2QYDmbK";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, message = 'No message provided' } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Create Discord embed
  const embed = {
    title: 'New Client Received',
    color: 3447003,
    fields: [
      { name: 'Name', value: name, inline: true },
      { name: 'Email', value: email, inline: true },
      { name: 'Phone', value: phone, inline: true },
      { name: 'Message', value: message }
    ],
    timestamp: new Date().toISOString()
  };

  try {
    const discordResponse = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] })
    });

    if (!discordResponse.ok) {
      throw new Error('Failed to send message to Discord');
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
}
