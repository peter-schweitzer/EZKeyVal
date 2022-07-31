const { readFileSync, writeFile, existsSync, lstatSync } = require('fs');

const { App, buildRes, serveFromFS, getBodyJSON } = require('@peter-schweitzer/ezserver');

const {
  port = '1337',
  route = '/route/not/configured',
  dataPath = 'DATAPATH_NOT_CONFIGURED',
  logging = false,
  DEBUG_ROUTS_ENABLED = false,
  aggressiveSync = false,
  noSync = false,
  syncInterval = 900000,
} = require('./config.json');

const LOG = console.log;
const WARN = console.warn;
const ERR = console.error;

let values = {};

/** @returns {void} */
function writeToFS() {
  try {
    writeFile(dataPath, JSON.stringify(values), { encoding: 'utf8', flag: 'w' }).catch;
  } catch (err) {
    ERR('unable to sync to FS', err);
  }
}

function readFromFS() {
  let vals;
  try {
    vals = !existsSync(dataPath)
      ? ERR("path doesn't exist", dataPath)
      : !lstatSync(dataPath).isFile()
      ? ERR('path is not a file', dataPath)
      : JSON.parse(readFileSync(dataPath));
  } catch (error) {
    ERR(`error while parsing ${dataPath}`, dataPath);
  }

  for (const key in vals) {
    values[key] = vals[key];
  }
}

function logInteraction(a, m, k, o, n = null) {
  LOG(`address: ${a} | method: ${m} | key: ${k} | (old) value: ${o}` + `${n === null ? '' : ` | new value: ${n}`}`);
}

readFromFS();
if (!aggressiveSync && !noSync) setInterval(readFromFS, syncInterval);

const app = new App(port);

app.addResolver('/', (req, res) => {
  serveFromFS(res, './html/home.html');
});

app.endpoints.add(route + '/ezkv', (req, res) => {
  buildRes(res, 'Bad Request\nmight use unsupported method', { code: 400, mime: 'text/plain' });
});

if (DEBUG_ROUTS_ENABLED) {
  app.addResolver(route + '/debug/load', (req, res) => {
    buildRes(res, 'resyncing data', { code: 200, mime: 'text/plain' });
    readFromFS();
  });

  app.addResolver(route + '/debug/data', (req, res) => {
    serveFromFS(res, dataPath);
  });

  app.addResolver(route + '/debug/dump', (req, res) => {
    WARN('dump', values);
    buildRes(res, JSON.stringify(values), { code: 200, mime: 'application/json' });
  });
}

app.rest.get(route, (req, res) => {
  const key = req.url.substring(route.length + 1);
  const val = values[key];

  if (aggressiveSync) values = readFromFS();

  buildRes(res, JSON.stringify({ value: val }), { code: 200, mime: 'application/json' });

  logging && logInteraction(req.socket.remoteAddress, 'GET', key, val);
});

app.rest.put(route, async (req, res) => {
  const old_val = values[key];

  const key = req.url.substring(route.length + 1);
  const { json, http_code } = await getBodyJSON(req);

  values[key] = json.value || old_val;
  res.writeHead(http_code).end();

  writeToFS();
  logging && logInteraction(req.socket.remoteAddress, 'PUT', key, old_val, values[key]);
});

