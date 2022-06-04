import { App, buildRes, serveFromFS } from './EZServer/EZServer.js';
import { Module } from './EZServer/modules/index.js';

import { REST, getBodyJSON } from './EZServer/modules/REST.js';

const LOG = console.log;

const app = new App('1337');

app.addModule(new Module('rest', REST));

app.addResolver('/', (req, res) => {
  serveFromFS('./EZServer/html/home.html', res);
});

values = {};

app.modules.rest.get('/api', (req, res) => {
  LOG('get:', req.url);
  buildRes(res, `{value: ${values[req.url.split('/api')[1]] || 'null'}}`, { code: 200, mime: 'application/json' });
});

app.rest.put('/api', (req, res) => {
  LOG('put:', req.url);
  let val;
  let key = req.url.split('/');
  key.shift();
  key = key.join('/');
  if (!!(val = getBodyJSON(req, res, ['value']))) values[key] = val;
});
