'use strict';

const Code = require('code');
const Hapi = require('hapi');
const Lab = require('lab');
const Understood = require('../');


const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;


describe('hapi plugin registration', () => {
  it('succeeds with locales option', (done) => {
    const server = new Hapi.Server();
    server.connection();
    server.register({ register: Understood, options: { locales: ['us'] } }, (err) => {
      expect(err).to.not.exist();
      done();
    });
  });

  it('succeeds with localesDir option', (done) => {
    const server = new Hapi.Server();
    server.connection();
    server.register({ register: Understood, options: { localesDir: (__dirname + '/locales') } }, (err) => {
      expect(err).to.not.exist();
      done();
    });
  });

  it('throws if missing all options', (done) => {
    const server = new Hapi.Server();
    server.connection();
    const fn = function () {
      server.register(Understood, (err) => {
        expect(err).to.not.exist();
      });
    };

    expect(fn).to.throw();
    done();
  });
});

describe('handling requests', () => {
  it('sets request.locales with correct Accept-Language from available locales', (done) => {
    const server = new Hapi.Server();
    server.connection();
    server.register({ register: Understood, options: { localesDir: (__dirname + '/locales') } }, (err) => {
      expect(err).to.not.exist();

      server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
          expect(request.locale).to.equal('en-US');
          reply('ok');
        }
      });

      server.inject({ url: '/', headers: { 'Accept-Language': 'en-GB,en-US;' } }, (res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });
  });

  it('sets request.locales to default when no match is found', (done) => {
    const server = new Hapi.Server();
    server.connection();
    server.register({ register: Understood, options: { localesDir: (__dirname + '/locales'), default: 'fr-CA' } }, (err) => {
      expect(err).to.not.exist();

      server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
          expect(request.locale).to.equal('fr-CA');
          reply('ok');
        }
      });

      server.inject({ url: '/', headers: { 'Accept-Language': 'en-GB;' } }, (res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });
  });
});
