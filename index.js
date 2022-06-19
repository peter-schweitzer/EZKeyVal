const { readFileSync, writeFileSync } = require('fs');

const { App, buildRes, serveFromFS } = require('./EZServer/EZServer');
const { getBodyJSON } = require('./EZServer/endpoints/REST');

const { port, route } = require('./config.json');

const LOG = console.log;

const app = new App(port);

let data_from_FS = '{}';
try {
  data_from_FS = readFileSync('./data.json', { encoding: 'utf8' });
} catch (e) {
  console.warn('Error while reading data.json', e);
}

let values = JSON.parse(data_from_FS);

/** @returns {void} */
function saveToFS() {
  writeFileSync('./data.json', JSON.stringify(values), { encoding: 'utf8' });
}

app.addResolver('/', (req, res) => {
  serveFromFS('./EZServer/html/home.html', res);
});

app.rest.get(route, (req, res) => {
  LOG('\n> GET:\n-------');
  LOG(' ip:', req.socket.remoteAddress);

  let key = req.url.substring(route.length + 1);
  LOG('key:', key);

  let val;
  LOG('val:', (val = values[key] || null));

  buildRes(res, JSON.stringify({ value: val }), { code: 200, mime: 'application/json' });
});

app.rest.put(route, async (req, res) => {
  LOG('\n> PUT:\n-------');
  LOG(' ip:', req.socket.remoteAddress);

  let key = req.url.substring(route.length + 1);
  LOG('key:', key);

  let { json, http_code } = await getBodyJSON(req);

  let val = values[key];
  LOG('old val:', val);

  if ((val = json.value) !== undefined) ((values[key] = val) || true) && LOG('new val:', val);
  else !(http_code = 0) && LOG('VALUE UNCHANGED');

  saveToFS();

  res.writeHead(http_code).end();
});

