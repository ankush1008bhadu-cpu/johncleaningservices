const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { sendWhatsApp } = require('../utils/whatsapp');
const { sendEmail } = require('../utils/mailer');

// Rate limiter: max 5 submissions per 15 minutes per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { success: false, message: 'Too many submissions. Please try again later.' }
});

// Validation rules
const validateContact = [
    body('fullName')
        .trim()
        .notEmpty().withMessage('Full name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters')
        .escape(),
    body('phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(/^[\d\s\+\-\(\)]{7,20}$/).withMessage('Invalid phone number')
        .escape(),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address')
        .normalizeEmail(),
    body('service')
        .trim()
        .notEmpty().withMessage('Please select a service')
        .isIn(['domestic', 'office', 'deep', 'end-of-tenancy', 'carpet'])
        .withMessage('Invalid service selected'),
    body('address')
        .trim()
        .notEmpty().withMessage('Address is required')
        .isLength({ min: 5, max: 300 }).withMessage('Address must be 5-300 characters')
        .escape(),
    body('preferredDate')
        .optional()
        .isISO8601().withMessage('Invalid date format'),
    body('message')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('Message too long (max 1000 chars)')
        .escape(),
    // Honeypot field - bots fill this, humans don't
    body('website').custom(val => {
        if (val && val.length > 0) throw new Error('Bot detected');
        return true;
    })
];

const SERVICE_LABELS = {
    'domestic': 'Domestic Cleaning',
    'office': 'Office Cleaning',
    'deep': 'Deep Cleaning',
    'end-of-tenancy': 'End of Tenancy Cleaning',
    'carpet': 'Carpet Cleaning'
};

router.post('/', limiter, validateContact, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array()[0].msg
        });
    }

    const { fullName, phone, email, service, address, preferredDate, message } = req.body;
    const serviceLabel = SERVICE_LABELS[service] || service;
    const dateStr = preferredDate ? new Date(preferredDate).toLocaleDateString('en-GB') : 'Not specified';

    const lead = { fullName, phone, email, service: serviceLabel, address, preferredDate: dateStr, message: message || 'N/A' };

    try {
        // Send WhatsApp notification (non-blocking)
        sendWhatsApp(lead).catch(err => console.error('WhatsApp error:', err.message));

        // Send email notification (non-blocking)
        sendEmail(lead).catch(err => console.error('Email error:', err.message));

        // Log to console as fallback
        console.log('\n📩 NEW LEAD RECEIVED:\n', JSON.stringify(lead, null, 2), '\n');

        res.json({
            success: true,
            message: 'Thank you! We received your request and will contact you within 1 hour.'
        });
    } catch (err) {
        console.error('Contact route error:', err);
        res.status(500).json({ success: false, message: 'Failed to process your request. Please call us directly.' });
    }
});

module.exports = router;
