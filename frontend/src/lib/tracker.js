// Lightweight first-party analytics / CDP tracker.
// Fire-and-forget: analytics must never break the storefront.
import { API_URL } from '../config/api';

const SID_KEY = 'aj_session_id';
const ID_KEY = 'aj_identity';
let memory = {};

function storageGet(key) {
    try { return localStorage.getItem(key); } catch { return memory[key] || null; }
}

function storageSet(key, value) {
    try { localStorage.setItem(key, value); } catch { memory[key] = value; }
}

export function getSessionId() {
    let sid = storageGet(SID_KEY);
    if (!sid) {
        sid = 'sess-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
        storageSet(SID_KEY, sid);
    }
    return sid;
}

// Associate this browser session with an email (login, checkout, newsletter).
export function identify(email) {
    if (email) storageSet(ID_KEY, email);
}

export function getIdentity() {
    return storageGet(ID_KEY) || '';
}

// Record a behavioral event: page_view | product_view | add_to_cart |
// checkout_started | purchase | newsletter_signup | search
export function track(type, data = {}) {
    try {
        fetch(`${API_URL}/api/track`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            keepalive: true,
            body: JSON.stringify({
                session_id: getSessionId(),
                type,
                email: getIdentity(),
                path: window.location.hash ? window.location.hash.slice(1) : window.location.pathname,
                referrer: document.referrer || '',
                ...data,
            }),
        }).catch(() => { });
    } catch { /* ignore */ }
}

// Capture a marketing lead into the customer data platform.
export function captureLead(email, name = '', consent = true, source = 'newsletter') {
    identify(email);
    return fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, consent, source, session_id: getSessionId() }),
    });
}
