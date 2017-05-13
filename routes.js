/**
 * Copyright (c) 2017. Ritesh Sangwan. All rights reserved.
 */

'use strict';

/**
 * Exposes the application routes
 *
 * @author      riteshsangwan
 * @version     1.0.0
 */

module.exports = {
  '/donors/search': {
    get: {
      controller: 'DonorController',
      method: 'search',
    },
  },
  '/donors': {
    post: {
      controller: 'DonorController',
      method: 'create',
    },
  },
  '/donors/:id': {
    put: {
      controller: 'DonorController',
      method: 'update',
    },
    delete: {
      controller: 'DonorController',
      method: 'delete',
    },
  },
};
