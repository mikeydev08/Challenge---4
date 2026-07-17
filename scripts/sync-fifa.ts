import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';

const URL = 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures?country=IN&wtw-filter=ALL';
const SCHEDULE_FILE_PATH = path.join(process.cwd(), 'src/lib/simulation/schedule.ts');

async function syncSchedule() {
  console.log(`Fetching live schedule from: ${URL}...`);

  try {
    const response = await fetch(URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch FIFA schedule: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Always dump the raw HTML so we can inspect it
    fs.writeFileSync('fifa-response-dump.html', html);
    console.log('Saved raw HTML to fifa-response-dump.html for inspection.');

    // Look for __NEXT_DATA__
    const nextDataScript = $('#__NEXT_DATA__').html();
    
    // Look for Nuxt state
    const nuxtMatch = html.match(/window\.__NUXT__\s*=\s*(.*?);<\/script>/);

    // Look for Apollo state
    const apolloMatch = html.match(/window\.__APOLLO_STATE__\s*=\s*(.*?);<\/script>/);

    // Look for generic preloaded state
    const preloadedMatch = html.match(/window\.__PRELOADED_STATE__\s*=\s*(.*?);<\/script>/);

    if (nextDataScript) {
      console.log('Found __NEXT_DATA__ script tag.');
      fs.writeFileSync('fifa-state-dump.json', JSON.stringify(JSON.parse(nextDataScript), null, 2));
      console.log('Saved state to fifa-state-dump.json');
    } else if (nuxtMatch) {
      console.log('Found Nuxt state.');
      fs.writeFileSync('fifa-state-dump.json', JSON.stringify(JSON.parse(nuxtMatch[1]), null, 2));
      console.log('Saved state to fifa-state-dump.json');
    } else if (apolloMatch) {
      console.log('Found Apollo state.');
      fs.writeFileSync('fifa-state-dump.json', JSON.stringify(JSON.parse(apolloMatch[1]), null, 2));
      console.log('Saved state to fifa-state-dump.json');
    } else if (preloadedMatch) {
      console.log('Found preloaded state.');
      fs.writeFileSync('fifa-state-dump.json', JSON.stringify(JSON.parse(preloadedMatch[1]), null, 2));
      console.log('Saved state to fifa-state-dump.json');
    } else {
      console.log('\n--- ANTI-BOT PROTECTION DETECTED ---');
      console.log('The FIFA website did not return any schedule data. Instead, it returned a minimal HTML page with a bot-challenge script (e.g. Akamai Bot Manager or DataDome).');
      console.log('Because this is a raw HTTP fetch, the request was flagged as a bot and blocked from seeing the real Next.js application state.');
      console.log('To successfully scrape this page in the future, you will need to:');
      console.log(' 1. Use a headless browser with stealth capabilities (e.g., puppeteer-extra-plugin-stealth or Playwright).');
      console.log(' 2. Alternatively, locate the backend JSON API endpoint FIFA uses and see if it requires specific headers or tokens to access directly.');
      console.log('------------------------------------\n');
    }

    console.log('Run `npm run sync-fifa` at any time to run this synchronization fetcher.');

  } catch (err) {
    console.error('Error synchronizing schedule:', err);
    process.exit(1);
  }
}

syncSchedule();
