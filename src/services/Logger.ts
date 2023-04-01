/**
 * A module for logging messages on the server and/or client console.
 * @module Logging
 */

import {RestAdaptor} from '../adaptors/RestAdaptor';
import {showErrorAlert, showWarningAlert} from '../components/Base/Alert';

/**
 * The Logger interface represents an abstract logger class used to log messages.
 * @interface
 */
export interface Logger {
  /**
   * Log a single message.
   * @param {string} level - Importance level of the message.
   * @param {string} message - Message to be logged.
   * @returns {void}
   */
  log: (level: string, message: string) => void;

  /**
   * Log an array of messages.
   * @param {string} level - Importance level of the messages.
   * @param {string[]} messages - An array of messages to be logged.
   * @returns {void}
   */
  log_messages: (level: string, messages: string[]) => void;
}

/**
 * The error log level.
 * @constant {string}
 */
const ERROR = 'error';

/**
 * The warning log level.
 * @constant {string}
 */
const WARNING = 'warning';

/**
 * The info log level.
 * @constant {string}
 */
const INFO = 'info';

/**
 * A class for implementing the ServerLogger using the Logger interface.
 * @implements {Logger}
 */
export class ServerLogger implements Logger {
  /**
   * The RestAdaptor instance used for sending logs to the server.
   * @private {RestAdaptor}
   */
  private readonly host: RestAdaptor;

  /**
   * Create a ServerLogger instance.
   * @constructor
   * @param {RestAdaptor} host - The RestAdaptor instance.
   */
  constructor(host: RestAdaptor) {
    this.host = host;
  }

  /**
   * Log a single message.
   * @param {string} level - Importance level of the message.
   * @param {string} message - Message to be logged.
   * @returns {void}
   */
  log = (level: string, message: string) => {
    this.log_messages(level, [message]);
  };

  /**
   * Log an array of messages.
   * @param {string} level - Importance level of the messages.
   * @param {string[]} messages - An array of messages to be logged.
   * @returns {void}
   */
  log_messages = (level: string, messages: string[]) => {
    this.host
      .post('log', {level: level, messages: messages})
      .catch((err) => {
        console.error(err);
      });
  };
}

/**
 * A global variable to store the logger instance.
 * @global
 * @type {Logger|null}
 */
export let gLogger: Logger | null = null;

/**
 * Create a new ServerLogger instance and store it in gLogger.
 * @param {RestAdaptor} host - The RestAdaptor instance.
 * @returns {void}
 */
export const createLogger = (host: RestAdaptor) => {
  gLogger = new ServerLogger(host);
};

/**
 * Log a single message.
 * @param {string} level - Importance level of the message.
 * @param {*} message - Message to be logged.
 * @param {boolean} include_stack - [Optional] include stack trace in message.
 * @returns {void}
 */
export const log = (level: string, message: any, include_stack?: boolean) => {
  // Determines whether to use console.log or console.error based on the include_stack parameter
  const conLog = include_stack ? console.error : console.log;
  const msg_str: string = makeString(message);

  conLog(`${level} - ${msg_str}`);

  // Sends log messages to the server if a logger instance exists
  if (gLogger !== null) {
    let args: string[] = [msg_str];

    // Includes stack trace if specified
    if (include_stack) {
      const stackTrace = Error().stack;
      if (stackTrace !== undefined) {
        args = [...args, ...stackTrace.split('\n')];
      }
    }

    gLogger.log_messages(level, args);
  }
};

/**
 * Log an info message.
 * @param {string} message - The message to be logged.
 * @returns {void}
 */
export const log_info = (message: string) => {
  log(INFO, message);
};

/**
 * Log a warning message and display a warning alert to the user.
 * @param {string} message - The message to be logged and displayed.
 * @returns {void}
 */
export const log_warning = (message: string) => {
  log(WARNING, message);
  showWarningAlert(message);
};

/**
 * Log an error message with stack trace and display an error alert to the user.
 * @param {*} message - Message to be logged and displayed.
 * @returns {void}
 */
export const log_error = (message: any) => {
  log(ERROR, message, true);
  showErrorAlert(message);
};

/**
 * Convert a message to string format.
 * @param {*} message - The message to be converted.
 * @returns {string}
 */
export const makeString = (message: any): string => {
  if (typeof message === 'string') {
    return message as string;
  } else if (message instanceof Error) {
    return message.message;
  }

  return JSON.stringify(message);
};