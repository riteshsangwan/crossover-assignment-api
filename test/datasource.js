/**
 * Copyright (c) 2017. Ritesh Sangwan. All rights reserved.
 */

'use strict';

/**
 * Datasource helper module for tests
 *
 * @author      riteshsangwan
 * @version     1.0.0
 */

const models = require('../models');
const data = require('./test_data.json');

const Donor = models.Donor;

/**
 * Clear all the table data in the DB
 *
 * @return  {Promise}                   the promise which will be resolved after records are deleted.
 */
function clearDb() {
  return Donor.remove({ });
}

/**
 * Insert test data for the tests
 *
 * @return  {Promise}                     the promise which will be resolved after records are deleted.
 */
function initDb() {
  return Donor.insertMany(data.donors);
}

module.exports = {
  clearDb,
  initDb,
};
