/**
 * Copyright (c) 2017. Ritesh Sangwan. All rights reserved.
 */

'use strict';

/**
 * The Donor model/schema
 *
 * @author      riteshsangwan
 * @version     1.0.0
 */

const mongoose = require('../datasource').getMongoose();
const _ = require('lodash');

const DonorLocationSchema = new mongoose.Schema({
  type: { type: String, required: true, default: 'Point' },
  coordinates: { type: [Number], required: true },
}, { _id: false });

const DonorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  address: { type: String, required: true },
  ip: { type: String, required: true },
  location: { type: DonorLocationSchema, required: true },
});

if (!DonorSchema.options.toObject) {
  DonorSchema.options.toObject = { };
}

/**
 * Transform the given document to be sent to client
 *
 * @param  {Object}   doc         the document to transform
 * @param  {Object}   ret         the already converted object
 * @param  {Object}   options     the transform options
 * @return {Object}               the plain javascript object
 */
DonorSchema.options.toObject.transform = function transform(doc, ret, options) {    // eslint-disable-line no-unused-vars
  const sanitized = _.omit(ret, '__v', '_id');
  sanitized.id = doc._id;
  return sanitized;
};

module.exports = {
  DonorSchema,
};
