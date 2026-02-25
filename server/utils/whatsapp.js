const axios = require('axios');

/**
 * Send lead notification via WhatsApp using CallMeBot free API
 * Setup: https://www.callmebot.com/blog/free-api-whatsapp-messages/
 */
async function sendWhatsApp(lead) {
    const { WHATSAPP_NUMBER, WHATSAPP_API_KEY } = process.env;

    if (!WHATSAPP_NUMBER || !WHATSAPP_API_KEY || WHATSAPP_API_KEY === 'your_callmebot_apikey') {
        console.log('⚠️  WhatsApp not configured. Skipping notification.');
        return;
    }

    const message = formatMessage(lead);
    const encodedMsg = encodeURIComponent(message);
    const url = `https://api.callmebot.com/whatsapp.php?phone=${WHATSAPP_NUMBER}&text=${encodedMsg}&apikey=${WHATSAPP_API_KEY}`;

    const response = await axios.get(url, { timeout: 10000 });
    console.log('✅ WhatsApp notification sent:', response.status);
}

function formatMessage(lead) {
    return `🧹 *New Website Lead - John's Cleaning*

📋 *Name:* ${lead.fullName}
📞 *Phone:* ${lead.phone}
📧 *Email:* ${lead.email}
🧰 *Service:* ${lead.service}
📍 *Address:* ${lead.address}
📅 *Date:* ${lead.preferredDate}
💬 *Message:* ${lead.message}

_Reply quickly to secure this client!_`;
}

module.exports = { sendWhatsApp, formatMessage };
