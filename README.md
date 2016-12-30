# understood
accept-language parsing plugin for hapi

## options

- `locales`: array of available locales that are supported
- `localesDir`: path to directory containing locale files. The available locales are read from the filenames inside of this directory.
- `default`: preferred default locale if a suitable one cannot be found

understood parses the `Accept-Language` header and sets the `request.locale` to the appropriate locale.

## usage

```js
const Hapi = require('hapi');
const Understood = require('understood');


server.register({ register: Understood, options: { localesDir: (__dirname + '/locales'), default: 'fr-CA' } }, (err) => {
  // handle err

  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      reply(request.locale);
    }
  });
});
```

Here are a couple of example curl requests to the above server.

```
$ curl -H 'Accept-Language: en-US' http://serverurl
en-US

$ curl http://serverurl
fr-CA
```
