/**
 * Copyright (c) 2017. Ritesh Sangwan. All rights reserved.
 */

'use strict';

/**
 * Bootstrap the application.
 * This module should be required before any other modules.
 *
 * @author      riteshsangwan
 * @version     1.0.0
 */

require('dotenv').config();
const path = require('path');
global.Promise = require('bluebird');
const mkdirp = require('mkdirp');
// ensure that the logs directory exists
mkdirp.sync(path.join(process.cwd(), 'logs'), '755');

const serviceHelper = require('./common/ServiceHelper');
// build all services
serviceHelper.buildService(require('./services/DonorService'));
