export interface RestAdaptor {
  get: (path: string) => Promise<Response>;
  delete: (path: string) => Promise<Response>;
  post: <T>(path: string, payload: T) => Promise<Response>;
  getHost: () => string;
}


export class HTTPRestAdaptor implements RestAdaptor {
  private readonly host: string;

  constructor(host: string) {
    this.host = host;
  }

  getHost = (): string => {
    return this.host;
  }

  get = async (path: string): Promise<Response> => {
    return fetch(this.makeUrl(path))
  }

  post = async <T>(path: string, payload: T): Promise<Response> => {
    const params = {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    }

    return fetch(this.makeUrl(path), params);
  }

  delete = async(path: string): Promise<Response> => {
    return fetch(this.makeUrl(path), { method: 'DELETE' });
  }

  makeUrl = (path: string): string => {
    return `http://${this.host}/${path}`;
  }
}