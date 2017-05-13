/**
 * Copyright (c) 2017. Ritesh Sangwan. All rights reserved.
 */

'use strict';

/**
 * Helps to build services, add logging to service method and add validators method
 *
 * @author      riteshsangwan
 * @version     1.0.0
 */
const logger = require('./Logger');
const helper = require('./Helper');

/**
 * Apply logger and validation decorators
 *
 * @param   {Object}    service       the service to wrap
 * @return  {Void}                    this function doesn't return anything
 */
function buildService(service) {
  helper.decorateWithValidators(service);
  logger.decorateWithLogging(service);
}

module.exports = {
  buildService,
};
