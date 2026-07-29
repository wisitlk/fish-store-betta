// Lightweight first-party analytics / CDP tracker.
// Fire-and-forget: analytics must never break the storefront.
//
// Behavioural tracking is opt-in. Until the visitor accepts analytics,
// track() drops events and no tracking identifier is written to storage.
// Actions the visitor explicitly initiates — subscribing to the newsletter,
// placing an order — are not analytics and are never gated by this consent.
import { API_URL } from '../config/api';

const SID_KEY = 'aj_session_id';
const ID_KEY = 'aj_identity';
const CONSENT_KEY = 'aj_analytics_consent'; // 'granted' | 'denied' | absent

let memory = {};

function storageGet(key) {
    try { return localStorage.getItem(key); } catch { return memory[key] || null; }
}

function storageSet(key, value) {
    try { localStorage.setItem(key, value); } catch { memory[key] = value; }
}

function storageRemove(key) {
    try { localStorage.removeItem(key); } catch { delete memory[key]; }
}

// 'granted' | 'denied' | null (undecided)
export function getConsent() {
    return storageGet(CONSENT_KEY);
}

export function hasAnalyticsConsent() {
    return getConsent() === 'granted';
}

// Record the visitor's choice. Declining clears any identifiers already held.
export function setConsent(granted) {
    storageSet(CONSENT_KEY, granted ? 'granted' : 'denied');
    if (!granted) {
        storageRemove(SID_KEY);
        storageRemove(ID_KEY);
        memory = {};
    }
}

function newSessionId() {
    return 'sess-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// Returns the analytics session id. Without consent the id lives only in
// memory for the current page, so nothing persistent is stored.
export function getSessionId() {
    if (!hasAnalyticsConsent()) {
        if (!memory[SID_KEY]) memory[SID_KEY] = newSessionId();
        return memory[SID_KEY];
    }
    let sid = storageGet(SID_KEY);
    if (!sid) {
        sid = newSessionId();
        storageSet(SID_KEY, sid);
    }
    return sid;
}

// Associate this browser with an email (login, checkout, newsletter).
export function identify(email) {
    if (!email) return;
    if (hasAnalyticsConsent()) storageSet(ID_KEY, email);
    else memory[ID_KEY] = email;
}

export function getIdentity() {
    return (hasAnalyticsConsent() ? storageGet(ID_KEY) : memory[ID_KEY]) || '';
}

// Record a behavioral event: page_view | product_view | add_to_cart |
// checkout_started | purchase | newsletter_signup | search
// No-op until the visitor has opted in to analytics.
export function track(type, data = {}) {
    if (!hasAnalyticsConsent()) return;
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

// Capture a marketing lead into the customer data platform. This is an
// explicit visitor action (they typed their address and submitted), so it is
// independent of the analytics consent banner.
export function captureLead(email, name = '', consent = true, source = 'newsletter') {
    identify(email);
    return fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, consent, source, session_id: getSessionId() }),
    });
}
