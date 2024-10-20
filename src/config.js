import serviceAccountDefault from "./initial.json" assert { type: "json" };
import serviceAccountMain from './adminsdk.json' assert { type: "json" };
import dotenv from 'dotenv';
import moment from "moment";
import * as winston from "winston";
import 'winston-daily-rotate-file';

import admin from "firebase-admin";
const loadEnv = dotenv.config({ path: process.env.dev == '1' ? './.env.development' : './.env.production' })


const env = loadEnv.error ? {}: loadEnv.parsed;

/*
var whitelist = ['http://localhost:3000', 'http:localhost:3000']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      console.log({ origin })
      callback(new Error('Not allowed by CORS'))
    }
  }
}
*/


const { format } = winston;

const transport1 = new winston.transports.DailyRotateFile({
  dirname: 'logs/public',
  level: 'info',
  filename: 'app-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: false,
  maxSize: '20m',
  maxFiles: '14d'
});

const transport2 = new winston.transports.DailyRotateFile({
  dirname: 'logs/public',
  level: 'error',
  filename: 'error-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: false,
  maxSize: '20m',
  maxFiles: '14d'
});

const infoLogger = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      console.log({ level })
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    transport1,
    //transport2
  ]
});


const errorLogger = winston.createLogger({
  level: 'error',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      console.log({ level })
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    //transport1,
    transport2
  ]
});

/*
logger.error("Error message");
logger.warn("Warning message");
logger.info("Info message");
logger.verbose("Verbose message");
logger.debug("Debug message");
logger.silly("Silly message");
*/

const corsOptions2 = {
  origin: 'http://localhost:3000',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200
}

const check = () => {

  const { DATABASEURL } = process.env;

  console.log({ databaseURL: DATABASEURL })
  
  if (serviceAccountDefault['project_id'] !== "") {
    console.log('use default;')
    return admin.initializeApp({
      projectId: serviceAccountDefault['project_id'],
      databaseURL: DATABASEURL
    });

  } else {
    console.log('use main;')
    return admin.initializeApp( { credential: admin.credential.cert(serviceAccountMain)});
  }
}

const adminApp = check();



export {
  corsOptions2, adminApp, infoLogger, errorLogger, env
}