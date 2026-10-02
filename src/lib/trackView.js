const OPT_OUT_KEY = 'skipViewTracking';

// Visit the site once with ?notrack to stop counting your own views on that browser; ?track turns counting back on.
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
    return host && host !== window.location.hostname ? host.slice(0, 255) : null;
  } catch {
    return null;
  }
}

export async function trackView(page) {
  if (['localhost', '127.0.0.1'].includes(window.location.hostname) || isOptedOut()) return;

  const sessionKey = `viewed:${page}`;
  try {
    if (sessionStorage.getItem(sessionKey)) return;
    sessionStorage.setItem(sessionKey, '1');
  } catch {
    // Storage blocked: still count the view.
  }

  const { supabase } = await import('./supabase');
  if (!supabase) return;
  supabase.from('page_views').insert({ page, referrer_host: getReferrerHost() }).then(() => {});
}
