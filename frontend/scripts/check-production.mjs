// Run after `npm run build`: node scripts/check-production.mjs
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { preview } from 'vite';
import { certificates } from '../src/data/qualifications.js';
import { projects, filterProjects } from '../src/data/projects.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = path => readFileSync(root + path);
const html = read('dist/index.html').toString();
assert.match(html, /<title>Lihini Gimhani \| Junior Software Engineer<\/title>/);
assert.match(html, /name="description"/);
assert.match(html, /href="\/favicon-lg.svg"/);
assert.equal(certificates.length, 11);
assert.equal(new Set(certificates.map(c => c.file)).size, 11);
assert.deepEqual(['All','Featured','Mobile','Web','Enterprise'].map(filter => filterProjects(filter).length), [5,3,2,3,1]);
assert.ok(projects.every(project => !project.demo), 'No unverified demo actions');

const assets = [
  ...certificates.map(c => `/certificates/${c.file}`),
  '/Lihini_Gimhani_CV.pdf', '/favicon-lg.svg', '/profile.png',
  ...readdirSync(root + 'public/projects').filter(f => f.endsWith('.svg')).map(f => `/projects/${f}`),
];
// Only the CV and the eleven approved certificates may be shipped as PDFs.
const approvedPdfs = assets.filter(path => path.endsWith('.pdf')).map(path => path.slice(1)).sort();
for (const directory of ['public','dist']) {
  const shippedPdfs = readdirSync(root + directory, {recursive:true})
    .filter(file => file.toLowerCase().endsWith('.pdf')).map(file => file.replaceAll('\\','/')).sort();
  assert.deepEqual(shippedPdfs, approvedPdfs, `${directory} PDF inventory`);
}
const server = await preview({ root, logLevel:'silent', preview:{host:'127.0.0.1',port:0} });
try {
  const base = `http://127.0.0.1:${server.httpServer.address().port}`;
  for (const path of assets) {
    const file = decodeURIComponent(path);
    const original = read('public' + file);
    assert.deepEqual(read('dist' + file), original, `Production copy: ${file}`);
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), original, `Served bytes: ${file}`);
    if (file.endsWith('.pdf')) {
      assert.match(response.headers.get('content-type'), /application\/pdf/);
      assert.equal(original.subarray(0,5).toString(), '%PDF-');
    }
  }
  console.log(`PASS: title, description, favicon, project filters, approved PDF inventory, and ${assets.length} production assets (12 original PDFs, portrait, favicon, 7 covers).`);
} finally {
  await new Promise((resolve,reject) => server.httpServer.close(error => error ? reject(error) : resolve()));
}
