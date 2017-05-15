/**
 * Copyright (c) 2017. Ritesh Sangwan. All rights reserved.
 */

'use strict';

/**
 * API's to manipulate/search donot postings
 *
 * @author      riteshsangwan
 * @version     1.0.0
 */

const joi = require('joi');

joi.objectId = require('joi-objectid')(joi);

const models = require('../models');
const helper = require('../common/Helper');
const errors = require('common-errors');
const config = require('config');
const _ = require('lodash');

const constants = require('../constants');
const ErrorCodes = require('../ErrorCodes');

const Donor = models.Donor;

const BLOOD_GROUPS = constants.BLOOD_GROUPS;

/**
 * Search all the donors within a specific bounds or
 * Search all the donors within a specified radius from a point
 *
 * @param   {Object}    criteria      the search criteria
 * @return  {Object}                  the paginated response, see swagger api spec for more details
 */
function* search(criteria) {
  const lo = helper.parseLimitAndOffset(criteria);
  const ne = criteria.ne;
  const sw = criteria.sw;
  const nw = [sw[0], ne[1]];
  const se = [ne[0], sw[1]];

  const donors = yield Donor.find({
    location: {
      $geoWithin: {
        $geometry: {
          type: 'Polygon',
          coordinates: [[ne, nw, sw, se, ne]],
          crs: {
            type: 'name',
            properties: { name: 'urn:x-mongodb:crs:strictwinding:EPSG:4326' },
          },
        },
      },
    },
  }).skip(lo.offset).limit(lo.limit);

  const total = yield Donor.count({
    location: {
      $geoWithin: {
        $geometry: {
          type: 'Polygon',
          coordinates: [[ne, nw, sw, se, ne]],
          crs: {
            type: 'name',
            properties: { name: 'urn:x-mongodb:crs:strictwinding:EPSG:4326' },
          },
        },
      },
    },
  });

  const docs = helper.getRawObject(donors);

  return { items: docs, paging: { total, next: (lo.limit + lo.offset) } };
}

// joi validation schema for search
search.schema = {
  criteria: joi.object().keys({
    limit: joi.number().integer().min(0).default(config.pagination.limit),
    offset: joi.number().integer().min(0).default(config.pagination.offset),
    // the north east bound
    ne: joi.array().items(joi.number().required()).length(2).required(),
    // the south west bound
    sw: joi.array().items(joi.number().required()).length(2).required(),
  }).required(),
};

/**
 * Create a donor posting
 *
 * @param   {String}    ip            the ip address of the donor computer
 * @param   {Object}    entity        the request payload
 * @return  {Object}                  the created Donor resource
 */
function* create(ip, entity) {
  const doc = _.extend(_.pick(entity, 'firstName', 'lastName', 'contactNumber', 'email', 'bloodGroup', 'address'), {
    ip,
    location: {
      coordinates: [entity.coordinates.lng, entity.coordinates.lat],
    },
  });
  const donor = yield Donor.create(doc);

  return helper.getRawObject(donor);
}

// joi validation schema for create
create.schema = {
  ip: joi.string().required(),
  entity: joi.object().keys({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    // the country code can be between 1 to 3 digits and mobile number only 10 digits
    // +1 for USA
    // +91 for India
    // +880 for Bangladesh
    // so the contact number must start with 0 or + and can have min 11 and max 13 digits
    contactNumber: joi.string().regex(/^([0]{2})|(\+)\d{11,13}$/).required(),
    email: joi.string().email().required(),
    bloodGroup: joi.string().valid(_.values(BLOOD_GROUPS)).required(),
    address: joi.string().required(),
    coordinates: joi.object().keys({
      lat: joi.number().required(),
      lng: joi.number().required(),
    }).required(),
  }).required(),
};

/**
 * Update a donor posting
 *
 * @param   {String}    id            the id of the donor
 * @param   {String}    ip            the ip address of the donor computer
 * @param   {Object}    entity        the request payload
 * @return  {Object}                  the updated Donor resource
 */
function* update(id, ip, entity) {
  const existing = yield Donor.findById(id);

  if (!existing) {
    throw new errors.NotFoundError('donor posting not found with specified id',
      new Error(ErrorCodes.RESOURCE_NOT_FOUND));
  }
  _.extend(existing, entity, { ip });
  const updated = yield existing.save();
  return helper.getRawObject(updated);
}

// joi validation schema for update
update.schema = {
  id: joi.objectId().required(),
  ip: joi.string().required(),
  entity: joi.object().keys({
    firstName: joi.string(),
    lastName: joi.string(),
    // the country code can be between 1 to 3 digits and mobile number only 10 digits
    // +1 for USA
    // +91 for India
    // +880 for Bangladesh
    // so the contact number must start with 0 or + and can have min 11 and max 13 digits
    contactNumber: joi.string().regex(/^([0]{2})|(\+)\d{11,13}$/),
    email: joi.string().email(),
    bloodGroup: joi.string().valid(_.values(BLOOD_GROUPS)),
    address: joi.string(),
  }).or('firstName', 'lastName', 'contactNumber', 'email', 'bloodGroup'),
};

/**
 * Delete a donor posting
 *
 * @param   {String}    id            the id of the donor
 * @return  {Void}                    this method doesn't return anything
 */
function* deleteDonor(id) {
  const existing = yield Donor.findById(id);

  if (!existing) {
    throw new errors.NotFoundError('donor posting not found with specified id',
      new Error(ErrorCodes.RESOURCE_NOT_FOUND));
  }
  yield existing.remove();
}

// joi validation schema for deleteDonor
deleteDonor.schema = {
  id: joi.objectId().required(),
};

module.exports = {
  search,
  create,
  update,
  delete: deleteDonor,
};
