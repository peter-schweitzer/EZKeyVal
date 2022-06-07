import { App, buildRes, serveFromFS } from './EZServer/EZServer.js';

import { getBodyJSON } from './EZServer/endpoints/REST.js';

const LOG = console.log;

const app = new App('1337');

app.addResolver('/', (req, res) => {
  serveFromFS('./EZServer/html/home.html', res);
});

let values = {};

app.rest.get('/api', (req, res) => {
  LOG('get:', req.url);
  let key = req.url.substring(5);
  buildRes(res, `{value: ${values[key] || 'null'}}`, { code: 200, mime: 'application/json' });
});

app.rest.put('/api', async (req, res) => {
  LOG('put:', req.url);

  let key = req.url.substring(5);

  let body;
  await getBodyJSON(req, res).then((json) => {
    body = json;
  });

  let val;
  if (!!(val = body.value)) values[key] = val;
});
