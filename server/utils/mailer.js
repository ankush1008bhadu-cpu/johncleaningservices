const nodemailer = require('nodemailer');

async function sendEmail(lead) {
    const { EMAIL_USER, EMAIL_PASS, OWNER_EMAIL } = process.env;

    if (!EMAIL_USER || !EMAIL_PASS || EMAIL_USER === 'your@gmail.com') {
        console.log('⚠️  Email not configured. Skipping notification.');
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: EMAIL_USER, pass: EMAIL_PASS }
    });

    const htmlBody = `
  <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 24px; border-radius: 8px;">
    <div style="background: #1E3A8A; padding: 20px 24px; border-radius: 8px 8px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 20px;">🧹 New Lead — John's Cleaning Services</h1>
    </div>
    <div style="background: white; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 10px; color: #6b7280; font-size: 14px; width: 140px;">Name</td><td style="padding: 10px; font-weight: 600; color: #111827;">${lead.fullName}</td></tr>
        <tr style="background:#f9fafb"><td style="padding: 10px; color: #6b7280; font-size: 14px;">Phone</td><td style="padding: 10px; font-weight: 600; color: #111827;">${lead.phone}</td></tr>
        <tr><td style="padding: 10px; color: #6b7280; font-size: 14px;">Email</td><td style="padding: 10px; font-weight: 600; color: #111827;">${lead.email}</td></tr>
        <tr style="background:#f9fafb"><td style="padding: 10px; color: #6b7280; font-size: 14px;">Service</td><td style="padding: 10px; font-weight: 600; color: #1E3A8A;">${lead.service}</td></tr>
        <tr><td style="padding: 10px; color: #6b7280; font-size: 14px;">Address</td><td style="padding: 10px; font-weight: 600; color: #111827;">${lead.address}</td></tr>
        <tr style="background:#f9fafb"><td style="padding: 10px; color: #6b7280; font-size: 14px;">Preferred Date</td><td style="padding: 10px; font-weight: 600; color: #111827;">${lead.preferredDate}</td></tr>
        <tr><td style="padding: 10px; color: #6b7280; font-size: 14px;">Message</td><td style="padding: 10px; color: #374151;">${lead.message}</td></tr>
      </table>
      <div style="margin-top: 20px; padding: 16px; background: #ecfdf5; border-radius: 8px; border-left: 4px solid #22C55E;">
        <p style="margin: 0; color: #15803d; font-weight: 600;">⚡ Reply quickly to secure this client!</p>
      </div>
    </div>
    <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">John's Cleaning Services — Automated Lead Notification</p>
  </div>`;

    await transporter.sendMail({
        from: `"John's Cleaning Website" <${EMAIL_USER}>`,
        to: OWNER_EMAIL || EMAIL_USER,
        subject: `🧹 New Quote Request from ${lead.fullName} — ${lead.service}`,
        html: htmlBody,
        text: `New Lead:\nName: ${lead.fullName}\nPhone: ${lead.phone}\nEmail: ${lead.email}\nService: ${lead.service}\nAddress: ${lead.address}\nDate: ${lead.preferredDate}\nMessage: ${lead.message}`
    });

    console.log('✅ Email notification sent to', OWNER_EMAIL || EMAIL_USER);
}

module.exports = { sendEmail };
