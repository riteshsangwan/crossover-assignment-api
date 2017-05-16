/**
 * Copyright (c) 2017. Ritesh Sangwan. All rights reserved.
 */

'use strict';

/**
 * Define the express app
 *
 * @author      riteshsangwan
 * @version     1.0.0
 */

require('./bootstrap');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const path = require('path');
const config = require('config');
const expressRequestId = require('express-request-id');
const requestIp = require('request-ip');
const cors = require('cors');

const helper = require('./common/Helper');
const errorMiddleware = require('./middlewares/ErrorMiddleware');
const logger = require('./common/Logger');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.set('port', config.PORT);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressRequestId({ attributeName: config.REQUEST_ID_ATTRIBUTE }));
app.use(express.static(path.resolve(__dirname, '..', 'build')));

const apiRouter = express.Router();

app.use(requestIp.mw());
// include io instance
apiRouter.use((req, res, next) => {
  res.io = io;
  next();
});

// load all routes
_.each(require('./routes'), (verbs, eurl) => {
  _.each(verbs, (def, verb) => {
    let actions = [
      function signatureWrappedFunction(req, res, next) {
        req.signature = `${def.controller}#{def.method}`;
        next();
      },
    ];
    const method = require(`./controllers/${def.controller}`)[def.method];
    if (!method) {
      throw new Error(`${def.method} is undefined, for controller ${def.controller}`);
    }
    if (def.middleware && def.middleware.length > 0) {
      actions = actions.concat(def.middleware);
    }
    actions.push(method);
    logger.debug(`Register ${verb} ${eurl}`);
    apiRouter[verb](eurl, helper.autoWrapExpress(actions));
  });
});

app.use(`/api/${config.API_VERSION}`, apiRouter);

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

app.use(errorMiddleware());

http.listen(app.get('port'), () => {
  logger.info(`Express server listening on port ${app.get('port')}`);
});

module.exports = app;
