import { google } from 'googleapis';
import cron from 'node-cron';

/**
 * File 4: Background Google Search Console Connector
 * Programmatic agent that submits sitemaps to Google daily.
 */

const webmasters = google.webmasters('v3');

async function syncSitemapToGoogle() {
  console.log('[SEO Agent]: Initiating Google Search Console Sync...');

  try {
    // 1. Parse authentication from environment
    const authData = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    if (!authData) {
      throw new Error('Missing GOOGLE_SERVICE_ACCOUNT_JSON environment variable');
    }

    const credentials = JSON.parse(authData);

    // 2. Authenticate via JWT client
    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/webmasters']
    });

    google.options({ auth });

    // 3. Submit live sitemap address
    const siteUrl = 'https://luxedoow.com/';
    const sitemapUrl = 'https://luxedoow.com/sitemap.xml';

    const response = await webmasters.sitemaps.submit({
      siteUrl: siteUrl,
      feedpath: sitemapUrl
    });

    if (response.status === 204) {
      console.log('[SEO Agent]: Sitemap successfully submitted to Google Search Console.');
    } else {
      console.log(`[SEO Agent]: Unexpected response status: ${response.status}`);
    }

  } catch (error: any) {
    console.error('[SEO Agent Error]: Failed to sync with Google Search Console:', error.message);
  }
}

/**
 * Schedule structural update sync: 
 * Wakes up daily at midnight (0 0 * * *)
 */
export function startSearchConsoleSync() {
  console.log('[SEO Agent]: Background SEO synchronization engine started.');
  
  // Weekly sync instead of daily to avoid quota issues for small shops, 
  // but keeping '0 0 * * *' as requested for daily.
  cron.schedule('0 0 * * *', async () => {
    await syncSitemapToGoogle();
  });
  
  // Trigger an initial sync on startup if in production
  if (process.env.NODE_ENV === 'production') {
    syncSitemapToGoogle();
  }
}

// Export for manual triggering
export { syncSitemapToGoogle };
