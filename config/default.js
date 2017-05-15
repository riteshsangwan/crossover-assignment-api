/**
 * Copyright (c) 2017. Ritesh Sangwan. All rights reserved.
 */

'use strict';

/**
 * The default app configuration
 *
 * @author      riteshsangwan
 * @version     1.0.0
 */

const path = require('path');

module.exports = {
  LOG_LEVEL: 'debug',
  LOG_FILE_NAME: path.join(process.cwd(), 'logs', 'assignment-app.log'),
  LOG_FILE_MAX_SIZE: 2 * 1024 * 1024,         // 2 MB max file size
  LOG_MAX_FILES: 1000,
  PORT: process.env.PORT || 4000,
  API_VERSION: 'v1',
  REQUEST_ID_ATTRIBUTE: 'id',
  // db connection options
  db: {
    url: 'mongodb://localhost:27017/assignment-app',
    poolSize: 100,
  },
  pagination: {
    limit: 10000,
    offset: 0,
  },
};
