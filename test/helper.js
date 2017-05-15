/**
 * Copyright (c) 2017. Ritesh Sangwan. All rights reserved.
 */

'use strict';

/**
 * Helper module for the tests.
 *
 * @author      riteshsangwan
 * @version     1.0.0
 */
const fs = require('fs');
const YAML = require('js-yaml');
const spec = require('swagger-tools').specs.v2;
const path = require('path');
const expect = require('chai').expect;

const swaggerObject = YAML.safeLoad(fs.readFileSync(path.join(process.cwd(), 'api', 'swagger.yml'), 'utf8'));

/**
 * Validate the given object/array against the swagger api specification
 *
 * @param   {String}          ref             the model definition reference
 * @param   {Object/Array}    obj             the object/array to validate
 * @param   {Function}        done            the callback to pass the validation result
 *                                            for tests directly pass the done callback of mocha
 * @return  {Void}                            this function does not return anything
 */
exports.validateModel = function (ref, obj, done) {
  spec.validateModel(swaggerObject, ref, obj, (err, result) => {
    if (err) {
      done(err);
    } else if (result) {
      // swagger model is not valid
      done(new Error(JSON.stringify(result)));
    } else {
      // swagger model is valid
      done();
    }
  });
};

/**
 * Assert the existence of error with the required message contains in error.message property
 *
 * @param   {Error}           error           the error to assert
 * @param   {String}          message         the message to assert
 * @param   {Function}        done            the callback to pass the validation result
 *                                            for tests directly pass the done callback of mocha
 * @return  {Void}                            this function does not return anything
 */
exports.assertError = function (error, message, done) {
  try {
    expect(error).to.exist();
    expect(error.message).to.have.string(message);
    // if this line is executing means that everything is success and test pass
    done();
  } catch (ae) {
    done(ae);
  }
};
