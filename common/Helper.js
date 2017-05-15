/*
 * Copyright (C) 2017 lets., All Rights Reserved.
 */

'use strict';

/**
 * This module exposes some generic helper methods
 *
 * @author      TSCCODER
 * @version     1.0.0
 */

const _ = require('lodash');
const co = require('co');
const Joi = require('joi');
const config = require('config');
const getParams = require('get-parameter-names');
const Errio = require('errio');

/**
 * Wrap generator function to standard express function
 *
 * @param   {Function}    fn          the generator function
 * @return  {Function}                the wrapped function
 */
function wrapExpress(fn) {
  return function expressWrappedFunction(req, res, next) {
    co(fn(req, res, next)).catch(next);
  };
}

/**
 * Wrap all generators from object
 *
 * @param   {Object}      obj         the object (controller exports)
 * @return  {Object|Array}            the wrapped object
 */
function autoWrapExpress(obj) {
  if (_.isArray(obj)) {
    return obj.map(autoWrapExpress);
  }
  if (_.isFunction(obj)) {
    if (obj.constructor.name === 'GeneratorFunction') {
      return wrapExpress(obj);
    }
    return obj;
  }
  _.each(obj, (value, key) => {
    obj[key] = autoWrapExpress(value);
  });
  return obj;
}

/**
 * Convert array with arguments to object
 *
 * @param  {Object}   params        the params
 * @param  {Array}    arr           the array to combine with params
 * @return {Object}                 the combined object
 */
function combineObject(params, arr) {
  const ret = {};
  _.each(arr, (arg, i) => {
    ret[params[i]] = arg;
  });
  return ret;
}

/**
 * Remove invalid properties from the object and hide long arrays
 *
 * @param   {Object}    obj         the object
 * @return  {Object}                the sanitized object
 */
function sanitizeObject(obj) {
  try {
    return JSON.parse(JSON.stringify(obj, (name, value) => {
      // Array of field names that should not be logged
      // add field if necessary (password, tokens etc)
      const removeFields = config.DEFAULT_SANITIZED_PROPERTIES || [];
      if (_.contains(removeFields, name)) {
        return '<removed>';
      }
      if (_.isArray(value) && value.length > 30) {
        return `Array(${value.length})`;
      }
      return value;
    }));
  } catch (e) {
    return obj;
  }
}

/**
 * Decorate all functions of a service and validate input values
 * and replace input arguments with sanitized result form Joi
 * Service method must have a `schema` property with Joi schema
 *
 * @param  {Object}   service       the service to decorate with validators
 * @return {void}                   function doesn't return anything.
 */
function decorateWithValidators(service) {
  _.each(service, (method, name) => {
    if (!method.schema) {
      return;
    }
    const params = getParams(method);
    service[name] = function* decoratedValidationGeneratorFunction() {
      const args = Array.prototype.slice.call(arguments);               // eslint-disable-line prefer-rest-params
      const value = combineObject(params, args);
      const normalized = Joi.attempt(value, method.schema);

      const newArgs = [];
      // Joi will normalize values
      // for example string number '1' to 1
      // if schema type is number
      _.each(params, (param) => {
        newArgs.push(normalized[param]);
      });
      return yield method.apply(this, newArgs);
    };
    service[name].params = params;
  });
}

/**
 * Get the plain javascript object from the mongoose Document
 *
 * @param  {Object/Array}   record        the mongoose document or array of documents to convert
 * @param  {Array}          skipKeys      the keys to skip
 * @return {Object}                       the plain javascript object
 */
function getRawObject(record, skipKeys) {
  if (_.isArray(record)) {
    const records = record.map((single) => {
      single = single.toObject();
      const srt = { };
      _.each(_.keys(single), (key) => {
        srt[key] = single[key];
      });
      return _.omit(srt, skipKeys);
    });
    return records;
  }
  record = record.toObject();
  const transformed = { };
  _.each(_.keys(record), (key) => {
    transformed[key] = record[key];
  });
  return _.omit(transformed, skipKeys);
}

/**
 * Serializes the given object, the object can be plain object or an error
 *
 * @param  {Object}         obj           the object/error to serialize
 * @return {Object}                       the serialized string representation
 */
function stringify(obj) {
  if (_.isError(obj)) {
    return Errio.stringify(obj);
  }
  return JSON.stringify(obj);
}

/**
 * Parses limit and offset values from the crteria object
 *
 * @param  {Object}         criteria      the criteria object to parse
 * @return {Object}                       the limit and offset values
 */
function parseLimitAndOffset(criteria) {
  const lo = { limit: config.pagination.limit, offset: config.pagination.offset };

  if (_.isObject(criteria) && _.isNumber(criteria.limit)) {
    lo.limit = criteria.limit;
  }
  if (_.isObject(criteria) && _.isNumber(criteria.offset)) {
    lo.offset = criteria.offset;
  }
  return lo;
}


module.exports = {
  wrapExpress,
  autoWrapExpress,
  combineObject,
  sanitizeObject,
  decorateWithValidators,
  getRawObject,
  stringify,
  parseLimitAndOffset,
};
