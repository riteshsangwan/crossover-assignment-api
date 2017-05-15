/**
 * Copyright (c) 2017. Ritesh Sangwan. All rights reserved.
 */

'use strict';

/**
 * Module to generate test data
 *
 * @author      riteshsangwan
 * @version     1.0.0
 */

require('../bootstrap');
const co = require('co');
const Donor = require('../models').Donor;
const logger = require('../common/Logger');
const helper = require('../common/Helper');
const data = require('./data/seed_data_v1.json');

const donors = data.donors;

co(function* seed() {
  logger.info('deleting previous data');
  yield Donor.remove({ });
  logger.info(`creating ${donors.length} donors`);
  yield Donor.insertMany(donors);
  logger.info('donors created successfully');
}).then(() => {
  logger.info('Done');
  process.exit();
}).catch((error) => {
  logger.error('unexpected error while inserting seed data', helper.stringify(error));
  process.exit();
});
