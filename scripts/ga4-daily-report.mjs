import { createSign } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const ANALYTICS_API_BASE = 'https://analyticsdata.googleapis.com/v1beta';
const ANALYTICS_SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';
const DEFAULT_TELEGRAM_CONFIG_PATH = `${process.env.HOME ?? ''}/.config/utc-bcn/telegram.env`;

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    const next = argv[index + 1];

    if (!current.startsWith('--')) {
      continue;
    }

    const [flag, inlineValue] = current.split('=');
    const key = flag.slice(2);

    if (inlineValue !== undefined) {
      args[key] = inlineValue;
      continue;
    }

    if (next && !next.startsWith('--')) {
      args[key] = next;
      index += 1;
      continue;
    }

    args[key] = true;
  }

  return args;
}

function base64UrlEncode(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function signJwt(unsignedToken, privateKey) {
  const signer = createSign('RSA-SHA256');
  signer.update(unsignedToken);
  signer.end();

  return signer
    .sign(privateKey, 'base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

async function loadCredentials(credentialsPath) {
  const raw = await readFile(credentialsPath, 'utf8');
  const parsed = JSON.parse(raw);

  if (parsed.type !== 'service_account') {
    throw new Error(`Expected a service account JSON, got "${parsed.type ?? 'unknown'}".`);
  }

  if (!parsed.client_email || !parsed.private_key) {
    throw new Error('Service account JSON is missing client_email or private_key.');
  }

  return parsed;
}

async function loadKeyValueFile(filePath) {
  if (!filePath || !existsSync(filePath)) {
    return {};
  }

  const raw = await readFile(filePath, 'utf8');

  return Object.fromEntries(
    raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const separator = line.indexOf('=');
        return [line.slice(0, separator), line.slice(separator + 1)];
      }),
  );
}

async function fetchAccessToken(credentials) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + 3600;

  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: credentials.client_email,
    sub: credentials.client_email,
    scope: ANALYTICS_SCOPE,
    aud: TOKEN_URL,
    iat: issuedAt,
    exp: expiresAt,
  };

  const unsignedToken = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(payload))}`;
  const signature = signJwt(unsignedToken, credentials.private_key);
  const assertion = `${unsignedToken}.${signature}`;

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Token request failed (${response.status}): ${errorBody}`);
  }

  const body = await response.json();

  if (!body.access_token) {
    throw new Error('Token response did not include access_token.');
  }

  return body.access_token;
}

async function runReport(accessToken, propertyId, body) {
  const response = await fetch(`${ANALYTICS_API_BASE}/properties/${propertyId}:runReport`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Analytics API request failed (${response.status}): ${errorBody}`);
  }

  return response.json();
}

function getMetricValue(row, index) {
  return Number(row?.metricValues?.[index]?.value ?? 0);
}

function formatPercent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function formatDuration(seconds) {
  const rounded = Math.round(seconds);
  const minutes = Math.floor(rounded / 60);
  const remainingSeconds = rounded % 60;

  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }

  return `${minutes}m ${remainingSeconds}s`;
}

function deltaSummary(current, previous) {
  if (previous === 0) {
    if (current === 0) {
      return 'flat vs previous day';
    }

    return 'up from 0 the previous day';
  }

  const percent = ((current - previous) / previous) * 100;

  if (percent === 0) {
    return 'flat vs previous day';
  }

  const direction = percent > 0 ? 'up' : 'down';
  return `${direction} ${Math.abs(percent).toFixed(1)}% vs previous day`;
}

function buildInsights(today, previous, topPages, topCountries) {
  const insights = [];

  insights.push(`Users are ${deltaSummary(today.activeUsers, previous.activeUsers)}.`);
  insights.push(`Sessions are ${deltaSummary(today.sessions, previous.sessions)}.`);
  insights.push(`Pageviews are ${deltaSummary(today.screenPageViews, previous.screenPageViews)}.`);

  if (today.engagementRate > 0) {
    insights.push(`Engagement rate was ${formatPercent(today.engagementRate)} with average session duration ${formatDuration(today.averageSessionDuration)}.`);
  }

  if (topPages[0]) {
    insights.push(`Top page was ${topPages[0].label} with ${topPages[0].views} views.`);
  }

  if (topCountries[0]) {
    insights.push(`Top country was ${topCountries[0].country} with ${topCountries[0].users} active users.`);
  }

  return insights;
}

function normalizeTopPages(report) {
  return (report.rows ?? []).map((row) => ({
    label: row.dimensionValues?.[0]?.value || '(not set)',
    views: getMetricValue(row, 0),
  }));
}

function normalizeTopCountries(report) {
  return (report.rows ?? []).map((row) => ({
    country: row.dimensionValues?.[0]?.value || '(not set)',
    users: getMetricValue(row, 0),
  }));
}

function renderReport({ propertyId, reportDate, totals, previousTotals, topPages, topCountries }) {
  const insights = buildInsights(totals, previousTotals, topPages, topCountries);
  const lines = [];

  lines.push('UTC-BCN GA4 Daily Report');
  lines.push(`Property: ${propertyId}`);
  lines.push(`Date: ${reportDate}`);
  lines.push('');
  lines.push(`Active users: ${totals.activeUsers}`);
  lines.push(`New users: ${totals.newUsers}`);
  lines.push(`Sessions: ${totals.sessions}`);
  lines.push(`Pageviews: ${totals.screenPageViews}`);
  lines.push(`Engagement rate: ${formatPercent(totals.engagementRate)}`);
  lines.push(`Average session duration: ${formatDuration(totals.averageSessionDuration)}`);
  lines.push('');
  lines.push('Insights:');

  for (const insight of insights) {
    lines.push(`- ${insight}`);
  }

  if (topPages.length > 0) {
    lines.push('');
    lines.push('Top pages:');

    for (const page of topPages.slice(0, 5)) {
      lines.push(`- ${page.label}: ${page.views} views`);
    }
  }

  if (topCountries.length > 0) {
    lines.push('');
    lines.push('Top countries:');

    for (const country of topCountries.slice(0, 5)) {
      lines.push(`- ${country.country}: ${country.users} active users`);
    }
  }

  return lines.join('\n');
}

function renderNoMeasurements({ propertyId, reportDate }) {
  return [
    'UTC-BCN GA4 Daily Report',
    `Property: ${propertyId}`,
    `Date: ${reportDate}`,
    '',
    'No measurements found',
  ].join('\n');
}

async function sendTelegramMessage(token, chatId, text) {
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Telegram API request failed (${response.status}): ${errorBody}`);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const propertyId = args['property-id'] ?? process.env.GA4_PROPERTY_ID ?? '532556826';
  const credentialsPath = args.credentials ?? process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const reportDate = args.date ?? 'yesterday';
  const previousDate = args['previous-date'] ?? '2daysAgo';
  const sendTelegram = Boolean(args.telegram);
  const telegramConfig = await loadKeyValueFile(
    args['telegram-config'] ?? process.env.TELEGRAM_CONFIG_PATH ?? DEFAULT_TELEGRAM_CONFIG_PATH,
  );
  const telegramBotToken = args['telegram-bot-token'] ?? process.env.TELEGRAM_BOT_TOKEN ?? telegramConfig.TELEGRAM_BOT_TOKEN;
  const telegramChatId = args['telegram-chat-id'] ?? process.env.TELEGRAM_CHAT_ID ?? telegramConfig.TELEGRAM_CHAT_ID;

  if (!credentialsPath) {
    throw new Error('Missing GOOGLE_APPLICATION_CREDENTIALS or --credentials.');
  }

  const credentials = await loadCredentials(credentialsPath);
  const accessToken = await fetchAccessToken(credentials);

  const [summaryReport, topPagesReport, topCountriesReport] = await Promise.all([
    runReport(accessToken, propertyId, {
      dateRanges: [
        { startDate: previousDate, endDate: previousDate },
        { startDate: reportDate, endDate: reportDate },
      ],
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'newUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'engagementRate' },
        { name: 'averageSessionDuration' },
      ],
      orderBys: [
        {
          dimension: {
            dimensionName: 'date',
          },
        },
      ],
    }),
    runReport(accessToken, propertyId, {
      dateRanges: [{ startDate: reportDate, endDate: reportDate }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [
        {
          metric: {
            metricName: 'screenPageViews',
          },
          desc: true,
        },
      ],
      limit: 5,
    }),
    runReport(accessToken, propertyId, {
      dateRanges: [{ startDate: reportDate, endDate: reportDate }],
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'activeUsers' }],
      orderBys: [
        {
          metric: {
            metricName: 'activeUsers',
          },
          desc: true,
        },
      ],
      limit: 5,
    }),
  ]);

  const summaryRows = summaryReport.rows ?? [];
  const previousRow = summaryRows[0];
  const currentRow = summaryRows[1];

  const totals = {
    activeUsers: getMetricValue(currentRow, 0),
    newUsers: getMetricValue(currentRow, 1),
    sessions: getMetricValue(currentRow, 2),
    screenPageViews: getMetricValue(currentRow, 3),
    engagementRate: getMetricValue(currentRow, 4),
    averageSessionDuration: getMetricValue(currentRow, 5),
  };

  const previousTotals = {
    activeUsers: getMetricValue(previousRow, 0),
    newUsers: getMetricValue(previousRow, 1),
    sessions: getMetricValue(previousRow, 2),
    screenPageViews: getMetricValue(previousRow, 3),
    engagementRate: getMetricValue(previousRow, 4),
    averageSessionDuration: getMetricValue(previousRow, 5),
  };

  const hasMeasurements = Object.values(totals).some((value) => value > 0);
  const output = hasMeasurements
    ? renderReport({
        propertyId,
        reportDate,
        totals,
        previousTotals,
        topPages: normalizeTopPages(topPagesReport),
        topCountries: normalizeTopCountries(topCountriesReport),
      })
    : renderNoMeasurements({ propertyId, reportDate });

  console.log(output);

  if (sendTelegram) {
    if (!telegramBotToken || !telegramChatId) {
      throw new Error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID for Telegram delivery.');
    }

    await sendTelegramMessage(telegramBotToken, telegramChatId, output);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
