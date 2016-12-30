'use strict';

const Assert = require('assert');
const Fs = require('fs');
const Path = require('path');
const AcceptLanguage = require('accept-language-parser');
const Package = require('../package.json');


const internals = {};


module.exports = function (server, options, next) {
  Assert(options.localesDir || options.locales, 'localesDir or locales is required to find available languages');

  const locales = options.locales || internals.findLocales(options.localesDir);

  server.ext('onPreHandler', internals.preHandler([options.default || ''].concat(locales)));

  next();
};


module.exports.attributes = {
  pkg: Package
};


internals.preHandler = function (locales) {
  return function (request, reply) {
    request.locale = AcceptLanguage.pick(locales, request.headers['accept-language']) || locales[0];
    reply.continue();
  };
};


internals.findLocales = function (localesDir) {
  const files = Fs.readdirSync(localesDir);

  return files.filter((file) => {
    return file[0] !== '.';
  }).map((file) => {
    return Path.basename(file, Path.extname(file));
  });
};
