# EZKeyVal

This repo is a simple key-value (values can be any valid json) store using the [EZServer template](https://github.com/peter-schweitzer/EZServer)

## Route-Key relation

you can define the endpoint route in the config.json

you access a key by appending it to the URL
like this: `route/of/the/endpoint/key-you-want-to-access`

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
- body: wont be checked

#### Response:

- a json-string (where the key `value` contains the value) with code 200

### Setting Values

you can save/overwrite values by sending a http request to [a route](#route-key-relation)

#### Request:

- method: 'PUT'
- body: any valid json-string with the content type: `appliaction/json`

#### Response:

- empty response with code 201

### Invalid Requests

- returns an empty response with code 404
