# EZKeyVal

This repo is a simple key-value (values can be any valid json) store using the [EZServer template](https://github.com/peter-schweitzer/EZServer)

## Config

default settings

| key                | default value   | description                                                                                |
| ------------------ | --------------- | ------------------------------------------------------------------------------------------ |
| port               | `"1337"`        | the port the server will be listening on                                                   |
| route              | `"/api"`        | the route of the endpoint                                                                  |
| dataPath           | `"./data.json"` | the path to where EZKeyVal will save the key-value-pairs (as json-string)                  |
| logging            | true            | controlls wether interactions should be logged or not                                      |
| DEBUG_ROUTS_ENABLE | true            | controlls wether the [debug routs](#debug-routs) should be added or not                    |
| aggressiveSync     | false           | controlls wether the dataPath is read on every GET request or not (disables sync interval) |
| noSync             | false           | controlls wether if the sync interval is set or not                                        |
| syncInterval       | 900000          | the interval in whitch the data is synced                                                  |

## Route-Key relation

you can define the endpoint route in the config.json

you access a key by appending it to the URL of the server
like this: `server.url/route/of/the/endpoint/key-you-want-to-access`

## debug-routs

routs for debugging

| route                   | description                                                                   |
| ----------------------- | ----------------------------------------------------------------------------- |
| `route + '/debug/load'` | this triggers a manual resync of the data                                     |
| `route + '/debug/data'` | returns the contents of `dataPath` with mime-type 'application/json'          |
| `route + '/debug/dump'` | returns the currently loadet data as a json with mime-type 'application/json' |

## Usage

you can start EZKeyVal by runing
`npm run start`
in its directory

- [getting values](#getting-values)
- [setting values](#setting-values)
- [invalid requests](#invalid-requests)

### Getting Values

you can retreive values by sending a http request to [a route](#route-key-relation)

#### Request:

- method: 'GET'
- body: is ignored

#### Response:

- a json response where the "value" contains the value (e.g. "{"value":value-of-the-key}") with code 200s

### Setting Values

you can save/overwrite values by sending a http request to [a route](#route-key-relation)

#### Request:

- method: 'PUT'
- body: any valid json-string with the content type: `appliaction/json`

#### Response:

- empty response with code 201

### Invalid Requests

- returns an empty response with code 400

<!--the request body for getting & setting values could be used for authentication-->

