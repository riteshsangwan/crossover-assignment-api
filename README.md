## Assignment app API's

### Introduction

The app will provide a bridge between the patients and the volunteer blood donors.

These are the backend api's for the react frontend application.

### Prerequisites

- nodejs: Node js version 6.9.x is required to run this application. A convient way to maanage and install multiple node js versions is [nvm](https://github.com/creationix/nvm)
- MongoDB: Latest mongo DB is required to run this application. As of this writing the latest version is 3.4 check official [docs](https://docs.mongodb.com/manual/installation/) to install mongodb for your platform.

### Configuration

The application uses [config](https://github.com/lorenwest/node-config) module to manage the application configuration

Below table details all the application configuration

| NAME  | DESCRIPTION  | VALUE  |
|:-:|:-:|:-:|
| LOG_LEVEL  | The application log level  | debug  |
| PORT  | The port on which server should listen  | 4000  |
| LOG_FILE_NAME  | The application uses winston for logging and file appender is configured. This is the location of log file. The log file directory is auto created. | `/logs/assignment-app.log`  |
| LOG_FILE_MAX_SIZE  | The maximum size of a log file before being rotated  | 2 * 1024 * 1024  |
| LOG_MAX_FILES  | Max number of log files to store  | 1000  |
| db.url  | The mongo db connection string  | `mongodb://localhost:27017/assignment-app`  |
| API_VERSION | The api version | v1 |

> NOTE: By default the application will connect to mongo db on `localhost` at port `27017`. Kindly update the db.url to point

### Seed data

To create dummy seed data
Run this command from the root of project

```
node run seed
```

This should insert two test donors in the DB. Both have location somewhere in New York City.


### Application setup

Next step is to install the node module dependencies and get the server running.

To install the dependencies run `npm install` from root of the project.

#### Linting

To lint the source run `npm run lint` from root of project.

There should not be any lint errors.

#### Start the server

To start the server run `npm run start`. This should start the server on port `4000` (default port).


### Tests

To run unit tests run, run this command from the root of project

```
npm run test
```