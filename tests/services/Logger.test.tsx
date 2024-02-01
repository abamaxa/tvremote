
// Mock RestAdaptor
import {Response} from "whatwg-fetch";
import {RestAdaptor} from "../../src/adaptors/RestAdaptor";
import {createLogger, log, log_info, log_error, log_warning, ServerLogger} from "../../src/services/Logger";

// const postedResponse = new Response("", {status: 200});
let mockRestAdaptor: RestAdaptor = {
  get: jest.fn(),
  delete: jest.fn(),
  post: jest.fn(() => Promise.resolve(new Response("", {status: 200}))),
  put: jest.fn(),
  getHost: jest.fn(),
};

// Mock console object
const mockConsole = {
  log: jest.fn(),
  error: jest.fn(),
};

describe("ServerLogger", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("log should call log_messages with correct level and message", () => {
    const logger = new ServerLogger(mockRestAdaptor);

    logger.log("testLevel", "testMessage");

    expect(mockRestAdaptor.post).toHaveBeenCalledWith("log", {
      level: "testLevel",
      messages: ["testMessage"],
    });
  });

  test("log_messages should call post with correct data", () => {
    const logger = new ServerLogger(mockRestAdaptor);

    logger.log_messages("testLevel", ["testMessage1", "testMessage2"]);

    expect(mockRestAdaptor.post).toHaveBeenCalledWith("log", {
      level: "testLevel",
      messages: ["testMessage1", "testMessage2"],
    });
  });
});

describe("log", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRestAdaptor.post.mockClear();
  });

  test("log should log message to console if gLogger is null", () => {
    console.log = jest.fn();
    const message = "testMessage";
    log("testLevel", message);

    expect(console.log).toHaveBeenCalledWith(`testLevel - ${message}`);
  });

  test("log should call gLogger.log_messages if gLogger is not null", () => {
    console.log = jest.fn();
    createLogger(mockRestAdaptor);

    const message = "testMessage";
    log("testLevel", message);

    expect(console.log).toHaveBeenCalledWith(`testLevel - ${message}`);
    expect(mockRestAdaptor.post).toHaveBeenCalledWith("log", {
      level: "testLevel",
      messages: [message],
    });
  });

  test("log should call gLogger.log_messages with stack trace if include_stack is true", () => {
    console.error = jest.fn();
    createLogger(mockRestAdaptor);

    const message = "testMessage";
    const error = new Error("testError");
    log("testLevel", message, true);

    expect(console.error).toHaveBeenCalledWith(`testLevel - ${message}`);
    expect(mockRestAdaptor.post).toHaveBeenCalled();

    const messages = mockRestAdaptor.post.mock.lastCall[1].messages;

    expect(messages.length).toBeGreaterThanOrEqual(10);
    expect(messages[0]).toEqual(message);
    expect(messages[1]).toEqual("Error");
    expect(messages[2]).toContain("at log (");
  });
});

describe("log_info", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("log_info should call log with INFO level and message", () => {
    console.log = jest.fn();
    const message = "testMessage";
    log_info(message);

    expect(console.log).toHaveBeenCalledWith(`info - ${message}`);
  });
});

describe("log_warning", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("log_warning should call log with WARN level and message", () => {
    console.log = jest.fn();
    const message = "testMessage";
    log_warning(message);

    expect(console.log).toHaveBeenCalledWith(`warning - ${message}`);
  });
});

describe("log_error", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("log_error should call log with ERROR level and message", () => {
    console.error = jest.fn();
    const message = "testMessage";
    log_error(message);

    expect(console.error).toHaveBeenCalledWith(`error - ${message}`);
  });
});
