/**
 * Copyright (c) 2017. Ritesh Sangwan. All rights reserved.
 */

'use strict';

/**
 * Init models
 *
 * @author      riteshsangwan
 * @version     1.0.0
 */
const config = require('config');

const db = require('../datasource').getDb(config.db.url, config.db.poolSize);
// Donor model
const DonorSchema = require('./Donor').DonorSchema;

const Donor = db.model('Donor', DonorSchema);

module.exports = {
  Donor,
};
