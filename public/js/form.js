/* ============================================================
   form.js — Quote form: validate → send to WhatsApp + API
   ============================================================ */

const WA_NUMBER = '447434870681';

const SERVICE_MAP = {
    'domestic': 'Domestic Cleaning',
    'office': 'Office Cleaning',
    'deep': 'Deep Cleaning',
    'end-of-tenancy': 'End of Tenancy Cleaning',
    'carpet': 'Carpet Cleaning'
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('quote-form');
    if (!form) return;

    const submitBtn = document.getElementById('form-submit');
    const successDiv = document.getElementById('form-success');

    // ── Date picker: set min to today, no past dates ──────────
    const datePicker = document.getElementById('preferredDate');
    if (datePicker) {
        const today = new Date();
        // Format as YYYY-MM-DD in local time (avoids UTC off-by-one)
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        datePicker.min = `${yyyy}-${mm}-${dd}`;

        // Block typing/pasting past dates
        datePicker.addEventListener('change', () => {
            if (datePicker.value < datePicker.min) {
                datePicker.value = datePicker.min;
            }
        });
    }

    // ── Real-time validation ──────────────────────────────────
    function showError(field, msg) {
        const input = form.querySelector(`[name="${field}"]`);
        const errEl = form.querySelector(`#err-${field}`);
        if (input) input.classList.add('error');
        if (errEl) { errEl.textContent = msg; errEl.classList.add('show'); }
    }

    function clearError(field) {
        const input = form.querySelector(`[name="${field}"]`);
        const errEl = form.querySelector(`#err-${field}`);
        if (input) input.classList.remove('error');
        if (errEl) errEl.classList.remove('show');
    }

    form.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('input', () => clearError(input.name));
        input.addEventListener('blur', () => validateField(input.name, input.value));
    });

    function validateField(name, value) {
        switch (name) {
            case 'fullName':
                if (!value.trim() || value.trim().length < 2) {
                    showError('fullName', 'Please enter your full name'); return false;
                }
                break;
            case 'phone':
                if (!/^[\d\s\+\-\(\)]{7,20}$/.test(value.trim())) {
                    showError('phone', 'Please enter a valid phone number'); return false;
                }
                break;
            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
                    showError('email', 'Please enter a valid email address'); return false;
                }
                break;
            case 'service':
                if (!value) { showError('service', 'Please select a service'); return false; }
                break;
            case 'address':
                if (!value.trim() || value.trim().length < 5) {
                    showError('address', 'Please enter your full address'); return false;
                }
                break;
        }
        return true;
    }

    function validateAll() {
        const fields = ['fullName', 'phone', 'email', 'service', 'address'];
        return fields.every(f => {
            const input = form.querySelector(`[name="${f}"]`);
            return input ? validateField(f, input.value) : true;
        });
    }

    // ── Build WhatsApp message ────────────────────────────────
    function buildWhatsAppURL(data) {
        const serviceLabel = SERVICE_MAP[data.service] || data.service;
        const dateStr = data.preferredDate
            ? new Date(data.preferredDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
            : 'Not specified';

        const msg =
            `🧹 *New Website Lead — John's Cleaning*

👤 *Name:* ${data.fullName}
📞 *Phone:* ${data.phone}
📧 *Email:* ${data.email}
🧰 *Service:* ${serviceLabel}
📍 *Address:* ${data.address}
📅 *Preferred Date:* ${dateStr}
💬 *Message:* ${data.message || 'N/A'}

_Please reply quickly to secure this client!_`;

        return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    }

    // ── Submit ────────────────────────────────────────────────
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateAll()) {
            // Scroll to first error
            const firstErr = form.querySelector('.form-control.error');
            if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        const formData = new FormData(form);
        const payload = Object.fromEntries(formData.entries());

        // Loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
      <svg class="spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>&nbsp;Processing…`;

        // 1. Build WhatsApp URL
        const waURL = buildWhatsAppURL(payload);

        // 2. Also fire the API in the background (non-blocking)
        fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).catch(() => { }); // silent — WhatsApp is the primary channel

        // 3. Show success UI first …
        form.style.display = 'none';
        successDiv.style.display = 'block';
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Set the WhatsApp fallback link
        const fallbackLink = document.getElementById('whatsapp-fallback');
        if (fallbackLink) fallbackLink.href = waURL;
        const fallbackWrap = document.getElementById('whatsapp-fallback-wrap');
        if (fallbackWrap) fallbackWrap.style.display = 'block';

        // 4. … then open WhatsApp (small delay so user sees the success message)
        setTimeout(() => {
            window.open(waURL, '_blank', 'noopener,noreferrer');
        }, 600);
    });
});
