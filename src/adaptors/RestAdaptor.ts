import {StatusCodes} from "../domain/Constants";
import {log_error} from "../services/Logger";

/**
 * Interface for a Rest Adaptor
 */
export interface RestAdaptor {
  /**
   * Makes a GET request at the specified endpoint
   * @param path The endpoint to send the request to
   * @returns A Promise with the response data
   */
  get: <T>(path: string, options?: RequestInit) => Promise<T>;
  
  /**
   * Makes a DELETE request at the specified endpoint
   * @param path The endpoint to send the request to
   * @returns A Promise with the response from the server
   */
  delete: (path: string) => Promise<Response>;
  
  /**
   * Makes a POST request at the specified endpoint with the specified payload
   * @param path The endpoint to send the request to
   * @param payload The data to send with the request
   * @returns A Promise with the response from the server
   */
  post: <T>(path: string, payload: T) => Promise<Response>;

  /**
   * Makes a PUT request at the specified endpoint with the specified payload
   * @param path The endpoint to send the request to
   * @param payload The data to send with the request
   * @returns A Promise with the response from the server
   */
  put: <T>(path: string, payload: T) => Promise<Response>;
  
  /**
   * Returns the current host of the adaptor connection
   * @returns A string representing the current host, or null if no host is set
   */
  getHost: () => string | null;
}

/**
 * Implementation of a Rest Adaptor using HTTP
 */
export class HTTPRestAdaptor implements RestAdaptor {
  private readonly host?: string;

  /**
   * Creates a new instance of the HTTPRestAdaptor with an optional host parameter
   * @param host An optional hostname to connect to
   */
  constructor(host?: string) {
    this.host = host;
  }

  /**
   * Returns the current host of the adaptor connection
   * @returns A string representing the current host, or null if no host is set
   */
  getHost = (): string | null => {
    return typeof this.host !== "undefined" ? this.host : null;
  }

  /**
   * Makes a GET request at the specified endpoint
   * @param path The endpoint to send the request to
   * @param options
   * @returns A Promise with the response data
   */
  get = async <T>(path: string, options?: RequestInit): Promise<T> => {
    const response = await fetch(this.makeUrl(path), options);
    if (response.status !== StatusCodes.OK) {
      throw new Error(
        `GET ${path} returned ${response.status} ${response.statusText}`
      );
    }

    try {
      return await response.json();
    } catch (error) {
      if (typeof options === "undefined") {
        return this.get(path, {cache: "reload"})
      } else {
        log_error(error,`could not fetch ${path}`);
        throw error;
      }
    }
  }

  /**
   * Makes a POST request at the specified endpoint with the specified payload
   * @param path The endpoint to send the request to
   * @param payload The data to send with the request
   * @returns A Promise with the response from the server
   */
  post = async <T>(path: string, payload: T): Promise<Response> => {
    return this.send('POST', path, JSON.stringify(payload));
  }

  /**
   * Makes a PUT request at the specified endpoint with the specified payload
   * @param path The endpoint to send the request to
   * @param payload The data to send with the request
   * @returns A Promise with the response from the server
   */
  put = async <T>(path: string, payload: T): Promise<Response> => {
    return this.send('PUT', path, JSON.stringify(payload));
  }

  /**
   * Sends an HTTP request with the specified method, endpoint and payload
   * @param method The HTTP method to use for the request
   * @param path The endpoint to send the request to
   * @param payload The data to send with the request
   * @returns A Promise with the response from the server
   */
  send = async (method: string, path: string, payload: string): Promise<Response> => {
    const params = {
      method: method,
      body: payload,
      headers: {
        'Content-Type': 'application/json'
      }
    }

    return fetch(this.makeUrl(path), params);
  }

  /**
   * Makes a DELETE request at the specified endpoint with the specified payload
   * @param path The endpoint to send the request to
   * @returns A Promise with the response from the server
   */
  delete = async(path: string): Promise<Response> => {
    return fetch(this.makeUrl(path), { method: 'DELETE' });
  }

  /**
   * Constructs a URL to use for the request, based on the current host and the specified endpoint
   * @param path The endpoint to construct the URL for
   * @returns A string with the URL for the specified endpoint
   */
  makeUrl = (path: string): string => {
    if (typeof this.host !== "undefined") {
      return `http://${this.host}/api/${path}`;
    }
    return `/api/${path}`;
  }
}