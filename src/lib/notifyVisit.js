const OPT_OUT_KEY = 'skipVisitNotify';

// Visit the site once with ?notrack to stop notifying for your own browser; ?track turns it back on.
function isOptedOut() {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has('notrack')) localStorage.setItem(OPT_OUT_KEY, '1');
    if (params.has('track')) localStorage.removeItem(OPT_OUT_KEY);
    return localStorage.getItem(OPT_OUT_KEY) === '1';
  } catch {
    return false;
  }
}

function getReferrerHost() {
  try {
    const host = new URL(document.referrer).hostname;
    return host && host !== window.location.hostname ? host : '';
  } catch {
    return '';
  }
}

// One ntfy push per page per browser session. On localhost only when the URL has ?notify, for previewing.
export function notifyVisit(page) {
  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  if (isLocal && !new URLSearchParams(window.location.search).has('notify')) return;
  if (!isLocal && isOptedOut()) return;

  const sessionKey = `notified:${page}`;
  try {
    if (sessionStorage.getItem(sessionKey)) return;
    sessionStorage.setItem(sessionKey, '1');
  } catch {
    // Storage blocked: still send the ping.
  }

  fetch('/api/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ page, referrer: getReferrerHost() }),
    keepalive: true,
  }).catch(() => {});
}
