# 🧹 John's Cleaning Services — Website

A complete, production-ready business website for a professional UK cleaning company.

## 📁 Project Structure

```
JOHN'S CLEANING/
├── public/                  # Frontend (static files)
│   ├── index.html           # Home page
│   ├── services.html        # Services page
│   ├── about.html           # About page
│   ├── contact.html         # Contact / Quote form
│   ├── css/style.css        # Global stylesheet
│   └── js/
│       ├── main.js          # Nav, animations, counters
│       ├── form.js          # Form validation & submission
│       └── before-after.js  # Image comparison slider
├── server/
│   ├── server.js            # Express app entry point
│   ├── routes/contact.js    # POST /api/contact
│   └── utils/
│       ├── whatsapp.js      # CallMeBot WhatsApp API
│       └── mailer.js        # Nodemailer email alerts
├── .env.example             # Environment variable template
├── package.json
└── README.md
```

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
```bash
cp .env.example .env
```
Edit `.env` with your real credentials (see below).

### 3. Start the server
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Environment Variables (`.env`)

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 3000) |
| `WHATSAPP_NUMBER` | Your WhatsApp number (e.g. `447700900000`) |
| `WHATSAPP_API_KEY` | CallMeBot API key (free) |
| `EMAIL_USER` | Gmail address for sending emails |
| `EMAIL_PASS` | Gmail App Password |
| `OWNER_EMAIL` | Email to receive lead notifications |
| `NODE_ENV` | `production` or `development` |

---

## 📲 WhatsApp Integration Setup (Free)

Uses **CallMeBot** free API — no paid subscription needed.

1. Save `+34 644 63 73 23` in your WhatsApp contacts as **CallMeBot**
2. Send the message: `I allow callmebot to send me messages`
3. You will receive your **API key** via WhatsApp within minutes
4. Add to `.env`:
   ```
   WHATSAPP_NUMBER=447XXXXXXXXX
   WHATSAPP_API_KEY=your_key_here
   ```

---

## 📧 Email Notifications Setup (Gmail)

1. Enable 2-Step Verification on your Google account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a password for "Mail"
4. Add to `.env`:
   ```
   EMAIL_USER=your@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx
   OWNER_EMAIL=owner@business.co.uk
   ```

---

## 🌐 Deployment

### Option A — Railway (Recommended, free tier)
1. Push to GitHub
2. Connect at [railway.app](https://railway.app)
3. Add environment variables in Railway dashboard
4. Deploy — Railway auto-detects Node.js

### Option B — Render
1. Push to GitHub
2. Connect at [render.com](https://render.com)
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `npm start`
5. Add environment variables

### Option C — VPS (DigitalOcean / Hetzner)
```bash
# Clone the repo
git clone https://github.com/yourusername/johns-cleaning.git
cd johns-cleaning
npm install
cp .env.example .env
# Edit .env...
npm install -g pm2
pm2 start server/server.js --name "johns-cleaning"
pm2 save && pm2 startup
```
Use Nginx as a reverse proxy and Certbot for free HTTPS.

---

## 🔒 Security Features

- **Helmet.js** — Sets secure HTTP headers
- **Rate Limiting** — Max 5 form submissions per 15 minutes per IP
- **Input Validation** — express-validator sanitizes all fields
- **Honeypot Field** — Hidden field to catch bots
- **HTTPS-ready** — Works behind any SSL-terminating proxy
- **CORS** — Restricted in production

---

## 🎨 Customisation

### Update contact details
Search and replace `07700 900000`, `info@johnscleaning.co.uk`, and `447700900000` with your real details across all HTML files.

### Change brand colours
Edit CSS variables in `public/css/style.css`:
```css
:root {
  --blue:  #1E3A8A;   /* Primary */
  --green: #22C55E;   /* Accent  */
}
```

### Update service areas
Edit the areas grid in `public/index.html` (search for `area-pill`).

---

## 📞 Support

For any questions about this website, WhatsApp: **07700 900000**
