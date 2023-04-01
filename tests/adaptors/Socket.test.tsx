import { WebSocket } from 'mock-socket';
import {Response} from "whatwg-fetch";
import {RemoteMessage} from '../../src/domain/Messages';
import {SocketAdaptor} from '../../src/adaptors/Socket';
import {EventType} from "@testing-library/react";


describe('SocketAdaptor', () => {
  let mockSocketBuilder: jest.Mock<WebSocket, [], any>;
  const mockOnMessage = jest.fn();
  let socketAdaptor: SocketAdaptor;
  let theSocket: WebSocket;

  beforeEach(() => {
    theSocket = new WebSocket('ws://localhost:8080');
    mockSocketBuilder = jest.fn(() => {return theSocket})
    socketAdaptor = new SocketAdaptor(mockSocketBuilder, mockOnMessage);
    theSocket.listeners.open.forEach((fn: (arg0: EventType | null) => any) => fn(null))
  });

  afterEach(() => {
    socketAdaptor.close();
    // @ts-ignore
    SocketAdaptor._instance = null;
    jest.restoreAllMocks();
  });

  it('should be a singleton instance', () => {
    const instance1 = new SocketAdaptor(mockSocketBuilder, mockOnMessage);
    const instance2 = new SocketAdaptor(mockSocketBuilder, mockOnMessage);
    expect(instance1).toBe(instance2);
  });

  it('should create a WebSocket instance', () => {
    expect(mockSocketBuilder).toHaveBeenCalled();
    expect(socketAdaptor.isReady()).toBeTruthy();
  });

  it('should add event listeners to the WebSocket instance', () => {
    // @ts-ignore
    socketAdaptor.listening = false;

    const mockAddEventListener = jest.spyOn(theSocket, 'addEventListener');
    socketAdaptor.addListeners();
    expect(mockAddEventListener).toHaveBeenCalledTimes(2);
    expect(mockAddEventListener).toHaveBeenCalledWith('open', expect.any(Function));
    expect(mockAddEventListener).toHaveBeenCalledWith('message', expect.any(Function));
  });

  it('should send a message to the server', () => {
    const testMessage = "Test message";
    const mockSend = jest.spyOn(theSocket, 'send');
    socketAdaptor.send(testMessage);
    expect(socketAdaptor.isReady()).toBeTruthy();
    expect(mockSend).toHaveBeenCalledWith(testMessage);
  });

  it('should receive a message from the server', async () => {
    const mockData = { id: '1', name: 'Test Task' };
    const response = new Response(JSON.stringify(mockData));
    const blob = await response.blob();
    const mockEvent = new MessageEvent('message', {
      data: blob,
    });
    jest.spyOn(Response.prototype, 'text').mockResolvedValue(JSON.stringify(mockData));

    await socketAdaptor.onReceive(mockEvent);

    expect(mockOnMessage).toHaveBeenCalledWith(mockData);
  });

  it('should log an error when receiving a non-JSON message', async () => {
    const mockData = 'Hello, world!';
    const mockEvent = new MessageEvent('message', {
      data: mockData,
    });
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await socketAdaptor.onReceive(mockEvent);

    expect(consoleSpy).toHaveBeenCalledWith(`error - error SyntaxError: Unexpected token 'H', \"${mockData}\" is not valid JSON, received unexpected message: ${mockData}`);
  });

  it('should close the WebSocket instance', () => {
    socketAdaptor.close();
    expect(socketAdaptor.socket).toBeUndefined();
    expect(socketAdaptor.isReady()).toBeFalsy();
  });
});
