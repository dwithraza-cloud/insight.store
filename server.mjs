import express from 'express';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
const app = express();
const dist = join(dirname(fileURLToPath(import.meta.url)), 'dist');
app.disable('x-powered-by');
app.use((req, res, next) => {
  if (/\/index\.html$/.test(req.path)) return res.redirect(301, req.path.replace(/index\.html$/, '') + (req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''));
  next();
});
app.use(express.static(dist, { setHeaders(res, file) {
  res.setHeader('Cache-Control', file.endsWith('.html') ? 'no-cache' : file.includes('/assets/') ? 'public, max-age=31536000, immutable' : 'public, max-age=604800');
} }));
app.use((_req, res) => { res.status(404).setHeader('X-Robots-Tag', 'noindex'); res.sendFile(join(dist, '404.html')); });
app.listen(Number(process.env.PORT) || 3000, '0.0.0.0', () => console.log('Insight Store is ready'));
