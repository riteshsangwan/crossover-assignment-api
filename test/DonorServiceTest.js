/**
 * Copyright (c) 2017. Ritesh Sangwan. All rights reserved.
 */

'use strict';

/**
 * Unit tests for DonorService
 *
 * @author      riteshsangwan
 * @version     1.0.0
 */
const donorService = require('../services/DonorService');
const co = require('co');
const ObjectID = require('bson-objectid');
const expect = require('chai').expect;
const helper = require('./helper');
const data = require('./test_data.json');
const datasource = require('./datasource');

before(function () {
  return datasource.clearDb();
});

after(function () {
  return datasource.clearDb();
});

describe('unit', function () {
  describe('DonorService', function () {

    beforeEach('insert some test data', function () {
      return datasource.initDb();
    });

    afterEach('clean test data', function () {
      return datasource.clearDb();
    });

    it('[search], should be successful', function (done) {
      co(function* () {
        return yield donorService.search({ ne: data.search.ne, sw: data.search.sw });
      }).then((response) => {
        expect(response).to.exist();
        expect(response.items).to.exist();
        expect(response.paging).to.exist();
        expect(response.paging.total).to.equal(2);
        expect(response.items.length).to.equal(2);
        helper.validateModel('#/definitions/Donors', response.items, done);
      }).catch(done);
    });

    it('[search], should be successful', function (done) {
      co(function* () {
        return yield donorService.search({ ne: data.search.ne, sw: data.search.sw, limit: 1, offset: 0 });
      }).then((response) => {
        expect(response).to.exist();
        expect(response.items).to.exist();
        expect(response.paging).to.exist();
        expect(response.paging.total).to.equal(2);
        expect(response.items.length).to.equal(1);
        helper.validateModel('#/definitions/Donors', response.items, done);
      }).catch(done);
    });

    it('[create], should be successful', function (done) {
      co(function* () {
        return yield donorService.create('34.45.56.67', {
          firstName: 'test',
          lastName: 'donor',
          contactNumber: '+12024077898',
          email: 'test@donor.com',
          bloodGroup: 'O-',
          address: '345, Highland Street, New Jersey, USA',
          coordinates: {
            lat: 28.439801,
            lng: 77.118279,
          },
        });
      }).then((response) => {
        expect(response).to.exist();
        expect(response.ip).to.equal('34.45.56.67');
        helper.validateModel('#/definitions/Donor', response, done);
      }).catch(done);
    });

    it('[update], should throw error for non existent donor posting', function (done) {
      co(function* () {
        yield donorService.update(ObjectID.generate(), '34.45.56.67', {
          firstName: 'first name updated',
        });
      }).then(() => {
        done(new Error('should not have been called'));
      }).catch((err) => {
        helper.assertError(err, 'donor posting not found with specified id', done);
      });
    });

    it('[update], should be successful', function (done) {
      co(function* () {
        const donor = yield donorService.create('34.45.56.67', {
          firstName: 'test',
          lastName: 'donor',
          contactNumber: '+12024077898',
          email: 'test@donor.com',
          bloodGroup: 'O-',
          address: '345, Highland Street, New Jersey, USA',
          coordinates: {
            lat: 28.439801,
            lng: 77.118279,
          },
        });

        return yield donorService.update(donor.id, '34.45.55.67', {
          firstName: 'first name updated',
        });
      }).then((response) => {
        expect(response).to.exist();
        expect(response.firstName).to.equal('first name updated');
        expect(response.ip).to.equal('34.45.55.67');
        helper.validateModel('#/definitions/Donor', response, done);
      }).catch(done);
    });

    it('[delete], should throw error for non existent donor posting', function (done) {
      co(function* () {
        yield donorService.delete(ObjectID.generate());
      }).then(() => {
        done(new Error('should not have been called'));
      }).catch((err) => {
        helper.assertError(err, 'donor posting not found with specified id', done);
      });
    });

    it('[delete], should be successful', function (done) {
      co(function* () {
        const donor = yield donorService.create('34.45.55.67', {
          firstName: 'test',
          lastName: 'donor',
          contactNumber: '+12024077898',
          email: 'test@donor.com',
          bloodGroup: 'O-',
          address: '345, Highland Street, New Jersey, USA',
          coordinates: {
            lat: 28.439801,
            lng: 77.118279,
          },
        });

        return yield donorService.delete(donor.id);
      }).then((response) => {
        expect(response).to.not.exist();
        done();
      }).catch(done);
    });


    it('[get], should throw error for non existent donor posting', function (done) {
      co(function* () {
        yield donorService.get(ObjectID.generate());
      }).then(() => {
        done(new Error('should not have been called'));
      }).catch((err) => {
        helper.assertError(err, 'donor posting not found with specified id', done);
      });
    });

    it('[get], should be successful', function (done) {
      co(function* () {
        const donor = yield donorService.create('34.45.55.67', {
          firstName: 'test',
          lastName: 'donor',
          contactNumber: '+12024077898',
          email: 'test@donor.com',
          bloodGroup: 'O-',
          address: '345, Highland Street, New Jersey, USA',
          coordinates: {
            lat: 28.439801,
            lng: 77.118279,
          },
        });

        return yield donorService.get(donor.id);
      }).then((response) => {
        expect(response).to.exist();
        helper.validateModel('#/definitions/Donor', response, done);
      }).catch(done);
    });

  });
});
