import { HTTPRestAdaptor, RestAdaptor } from "../../src/adaptors/RestAdaptor";


describe("HTTPRestAdaptor", () => {
  let mockHost: string;
  let restAdaptor: HTTPRestAdaptor;

  beforeEach(() => {
    mockHost = "localhost:8080";
    restAdaptor = new HTTPRestAdaptor(mockHost);
    // global.fetch is undefined in the jsdom runtime
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ status: 200 }),
      })
    );
  });

  afterEach(() => {
    // @ts-ignore
    global.fetch = undefined;
  });

  it("should get host", () => {
    expect(restAdaptor.getHost()).toEqual(mockHost);
  });

  it("should make URL with host", () => {
    const path = "tasks";
    const expectedUrl = `http://${mockHost}/api/${path}`;
    expect(restAdaptor.makeUrl(path)).toEqual(expectedUrl);
  });

  it("should make URL without host", () => {
    const path = "tasks";
    restAdaptor = new HTTPRestAdaptor();
    const expectedUrl = `/api/${path}`;
    expect(restAdaptor.makeUrl(path)).toEqual(expectedUrl);
  });

  it("should get data from server with GET request", async () => {
    const mockData = {id: "1", name: "Test Task"};

    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockData),
      })
    );

    const path = "tasks/1";
    const data = await restAdaptor.get(path);
    expect(global.fetch).toHaveBeenCalledWith(
      `http://${mockHost}/api/${path}`
    );
    expect(data).toEqual(mockData);
  });

  it("should send data to server with POST request", async () => {
    const mockPayload = {name: "New Task"};

    const path = "tasks";
    const response = await restAdaptor.post(path, mockPayload);
    expect(global.fetch).toHaveBeenCalledWith(
      `http://${mockHost}/api/${path}`,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(mockPayload),
      })
    );
    expect(response.status).toEqual(200);
  });

  it("should update data on server with PUT request", async () => {
    const mockPayload = {id: "1", name: "Updated Task"};
    jest.spyOn(global, "fetch").mockResolvedValue({
      status: 200,
    } as Response);

    const path = "tasks/1";
    const response = await restAdaptor.put(path, mockPayload);
    expect(global.fetch).toHaveBeenCalledWith(
      `http://${mockHost}/api/${path}`,
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify(mockPayload),
      })
    );
    expect(response.status).toEqual(200);
  });

  it("should delete data on server with DELETE request", async () => {
    const path = "tasks/1";
    const response = await restAdaptor.delete(path);
    expect(global.fetch).toHaveBeenCalledWith(
      `http://${mockHost}/api/${path}`,
      expect.objectContaining({
        method: "DELETE",
      })
    );
    expect(response.status).toEqual(200);
  });
})
