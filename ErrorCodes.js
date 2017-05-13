/**
 * Copyright (c) 2017. Ritesh Sangwan. All rights reserved.
 */

'use strict';

/**
 * Define all application level error codes
 *
 * @author      riteshsangwan
 * @version     1.0.0
 */

module.exports = {
  // this error code signifies that the cause of the thrown error is unknow, this is top level error code and most critical
  UNKNOWN: 'E1001',
  // this validation error is thrown when joi validation failed, the error details are captured in err.details property
  GENERIC_VALIDATION_ERROR: 'E1010',
  // this error indicates that more than one resource is found for specified unique attribute
  MULTIPLE_DATABASE_RECORDS: 'E1020',
  // generic error that represents specified resource is not found with given primary key
  RESOURCE_NOT_FOUND: 'E1030',
  // this error is expected when application encounters some unexpected data
  GENERIC_DATA_ERROR: 'E1050',
};
