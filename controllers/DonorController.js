/**
 * Copyright (c) 2017. Ritesh Sangwan. All rights reserved.
 */

'use strict';

/**
 * Route handlers for `/donors` API's
 *
 * @author      riteshsangwan
 * @version     1.0.0
 */

const httpStatus = require('http-status');
const donorService = require('../services/DonorService');

/**
 * Search all the donors within a specific bounds or
 * Search all the donors within a specified radius from a point
 *
 * @param   {Object}    req           express request instance
 * @param   {Object}    res           express response instance
 * @return  {Void}                    this method doesn't return anything
 */
function* search(req, res) {
  res.status(httpStatus.OK).json(yield donorService.search(req.query));
}

/**
 * Create a donor posting
 *
 * @param   {Object}    req           express request instance
 * @param   {Object}    res           express response instance
 * @return  {Void}                    this method doesn't return anything
 */
function* create(req, res) {
  res.status(httpStatus.CREATED).json(yield donorService.create(req.clientIp, req.body));
}

/**
 * Update a donor posting
 *
 * @param   {Object}    req           express request instance
 * @param   {Object}    res           express response instance
 * @return  {Void}                    this method doesn't return anything
 */
function* update(req, res) {
  res.status(httpStatus.CREATED).json(yield donorService.update(req.id, req.clientIp, req.body));
}

/**
 * Delete a donor posting
 *
 * @param   {Object}    req           express request instance
 * @param   {Object}    res           express response instance
 * @return  {Void}                    this method doesn't return anything
 */
function* deleteDonor(req, res) {
  res.status(httpStatus.OK).json(yield donorService.delete(req.id));
}

module.exports = {
  search,
  create,
  update,
  delete: deleteDonor,
};
