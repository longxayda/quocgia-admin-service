#!/usr/bin/env node
/**
 * API smoke tests (Plan section 3).
 * Run with: node scripts/api-test.js
 * Requires: backend running at BASE_URL (default http://localhost:5000).
 * Usage: BASE_URL=http://localhost:5000 node scripts/api-test.js
 */
const BASE = process.env.BASE_URL || 'http://localhost:5000';
const API = `${BASE}/api`;

let passed = 0;
let failed = 0;

function ok(name, condition, detail = '') {
  if (condition) {
    passed++;
    console.log(`  OK: ${name}${detail ? ` (${detail})` : ''}`);
    return true;
  }
  failed++;
  console.log(`  FAIL: ${name}${detail ? ` - ${detail}` : ''}`);
  return false;
}

async function get(path) {
  const res = await fetch(`${API}${path}`, { method: 'GET' });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    // leave json null
  }
  return { status: res.status, json, text };
}

async function run() {
  console.log('API tests (plan section 3)\n');
  console.log(`Base: ${API}\n`);

  // 3.0 Health (app-level)
  const healthRes = await fetch(`${BASE}/health`);
  const healthJson = healthRes.ok ? await healthRes.json().catch(() => ({})) : {};
  ok('Health /health', healthRes.status === 200 && healthJson.status === 'ok');

  // 3.1 Public heritages
  const h1 = await get('/heritages?lang=vi&page=1&limit=10');
  ok(
    'GET /heritages',
    h1.status === 200 && Array.isArray(h1.json?.data) && h1.json?.pagination != null,
    h1.status !== 200 ? `status ${h1.status}` : ''
  );

  // 3.2 Public heritage by id (may 404 if no data)
  const firstId = h1.json?.data?.[0]?.id;
  if (firstId != null) {
    const h2 = await get(`/heritages/${firstId}?lang=vi`);
    ok('GET /heritages/:id (existing)', h2.status === 200 && h2.json && !h2.json.error);
  } else {
    const h2 = await get('/heritages/999999?lang=vi');
    ok('GET /heritages/:id (404)', h2.status === 404 && (h2.json?.message || h2.json?.error));
  }

  // 3.3 Music
  const m = await get('/music?page=1&limit=10');
  ok(
    'GET /music',
    m.status === 200 && Array.isArray(m.json?.data) && m.json?.pagination != null,
    m.status !== 200 ? `status ${m.status}` : ''
  );

  // 3.4 Fineart
  const f = await get('/fineart?page=1&limit=10');
  ok(
    'GET /fineart',
    f.status === 200 && Array.isArray(f.json?.data) && f.json?.pagination != null,
    f.status !== 200 ? `status ${f.status}` : ''
  );

  // 3.5 Map places
  const mp = await get('/map-places');
  ok(
    'GET /map-places',
    mp.status === 200 && mp.json?.success === true && Array.isArray(mp.json?.data),
    mp.status !== 200 ? `status ${mp.status}` : ''
  );

  // 3.6 Languages
  const lang = await get('/languages');
  ok(
    'GET /languages',
    lang.status === 200 && lang.json?.success === true && Array.isArray(lang.json?.data),
    lang.status !== 200 ? `status ${lang.status}` : ''
  );

  // 3.7 Ranking types
  const rank = await get('/constants/ranking-types');
  ok(
    'GET /constants/ranking-types',
    rank.status === 200 && rank.json?.success === true && Array.isArray(rank.json?.data),
    rank.status !== 200 ? `status ${rank.status}` : ''
  );

  // 3.8 Admin heritages
  const ah = await get('/admin/heritages?page=1&limit=10');
  ok(
    'GET /admin/heritages',
    ah.status === 200 && ah.json?.success === true && Array.isArray(ah.json?.data),
    ah.status !== 200 ? `status ${ah.status}` : ''
  );

  // 3.9 Admin music
  const am = await get('/admin/music?page=1&limit=10');
  ok(
    'GET /admin/music',
    am.status === 200 && am.json?.success === true && Array.isArray(am.json?.data),
    am.status !== 200 ? `status ${am.status}` : ''
  );

  // 3.10 Admin fineart
  const af = await get('/admin/fineart?page=1&limit=10');
  ok(
    'GET /admin/fineart',
    af.status === 200 && af.json?.success === true && Array.isArray(af.json?.data),
    af.status !== 200 ? `status ${af.status}` : ''
  );

  // 3.11 Unknown route -> 404 JSON
  const notFound = await get('/unknown-route');
  const is404Json =
    notFound.status === 404 &&
    notFound.json &&
    (notFound.json.message === 'Not found' || notFound.json.error === 'Not found');
  ok('GET /unknown-route (404 JSON)', is404Json, notFound.status !== 404 ? `status ${notFound.status}` : '');

  // 404 for non-existing heritage id
  const h404 = await get('/heritages/999999?lang=vi');
  ok(
    'GET /heritages/999999 (404)',
    h404.status === 404 && (h404.json?.message || h404.json?.error),
    h404.status !== 404 ? `status ${h404.status}` : ''
  );

  console.log('\n---');
  console.log(`Passed: ${passed}, Failed: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
