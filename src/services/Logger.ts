import {RestAdaptor} from "../adaptors/RestAdaptor";

export interface Logger {

  log: (level: string, message: string) => void;
  log_messages: (level: string, messages: string[]) => void;
}

const ERROR = "error";
const WARNING = "warning";
const INFO = "info";

export class ServerLogger implements Logger {

  private readonly host: RestAdaptor;

  constructor(host: RestAdaptor) {
    this.host = host;
  }

  log = (level: string, message: string) => {
    this.log_messages(level, [message]);
  }

  log_messages = (level: string, messages: string[]) => {
    this.host.post('log', {level: level, messages: messages})
      .catch((err) => {
        console.error(err)
      })
  }
}

export let gLogger: Logger | null = null;

export const createLogger = (host: RestAdaptor) => {
  gLogger = new ServerLogger(host);
}

export const log = (level: string, message: string) => {
  const conLog = level === ERROR ? console.error : console.log;

  if (gLogger === null) {
    conLog(`NO LOGGER: ${level} - ${message}`)
  } else {
    conLog(`${level} - ${message}`)
    gLogger.log(level, message);
  }
}

export const log_info = (message: string) => {
  log(INFO, message);
}

export const log_warning = (message: string) => {
  log(WARNING, message);
  alert(message);
}

export const log_error = (message: string) => {

  const stackTrace = Error().stack;

  const msg_str = JSON.stringify(message);

  if (stackTrace === undefined || gLogger == null) {
    log(ERROR, message);
  } else {
    const parts = stackTrace.split("\n");
    gLogger.log_messages(ERROR, [msg_str, ...parts]);
  }

  alert(message);
}
