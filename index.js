import { App, buildRes, serveFromFS } from './EZServer/EZServer.js';

import { getBodyJSON } from './EZServer/endpoints/REST.js';

const LOG = console.log;

const app = new App('1337');

app.addResolver('/', (req, res) => {
  serveFromFS('./EZServer/html/home.html', res);
});

let values = {};

app.rest.get('/api', (req, res) => {
  LOG('\n> GET:\n-------');
  LOG(' ip:', req.socket.remoteAddress);

  let key = req.url.substring(5);
  LOG('key:', key);

  let val;
  LOG('val:', (val = values[key] || null));

  buildRes(res, JSON.stringify({ value: val }), { code: 200, mime: 'application/json' });
});

app.rest.put('/api', async (req, res) => {
  LOG('\n> PUT:\n-------');
  LOG(' ip:', req.socket.remoteAddress);

  let key = req.url.substring(5);
  LOG('key:', key);

  let { json, http_code } = await getBodyJSON(req);

  let val = values[key];
  LOG('old val:', val);

  if ((val = json.value) !== undefined) ((values[key] = val) || true) && LOG('new val:', val);
  else !(http_code = 0) && LOG('VALUE UNCHANGED');

  res.writeHead(http_code).end();
});

