jest.mock("../../src/components/Base/Alert", () => {
  return {
    __esModule: true,
    ...jest.requireActual("../../src/components/Base/Alert"),
    askQuestion: jest.fn(),
  };
});

import {Player, VideoPlayer} from "../../src/services/Player";
import {RestAdaptor} from "../../src/adaptors/RestAdaptor";
import * as Alert from "../../src/components/Base/Alert";
// import {askQuestion} from "../../src/components/Base/Alert";

describe('VideoPlayer', () => {
  let player: Player;
  let host: RestAdaptor;
  let collection: string;
  let setCurrentCollectionHook: (newCollection: string) => void;

  beforeEach(() => {
    setCurrentCollectionHook = jest.fn();
    host = {
      get: jest.fn(),
      delete: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      getHost: jest.fn(),
    };
    player = new VideoPlayer(collection, setCurrentCollectionHook, host);
  });

  describe('getAvailableConversions', () => {
    it('should call get with `conversion` path and return available conversions', async () => {
      const mockConversions = [{name: 'MP4', description: 'MPEG-4 video file'}];
      (host.get as jest.Mock).mockResolvedValueOnce({results: mockConversions, error: null});
      const result = await player.getAvailableConversions();
      expect(host.get).toHaveBeenCalledWith('conversion');
      expect(result).toEqual(mockConversions);
    });

    it('should log error if response has an error', async () => {
      (host.get as jest.Mock).mockResolvedValueOnce({results: null, error: 'Some error'});
      const logErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      });
      const result = await player.getAvailableConversions();
      expect(logErrorSpy).toHaveBeenCalledWith('error - conversions are unavailable: Some error');
      expect(result).toEqual([]);
      logErrorSpy.mockRestore();
    });

    it('should log error if an error occurs while fetching conversions', async () => {
      (host.get as jest.Mock).mockRejectedValueOnce('Some error');
      const logErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      });
      const result = await player.getAvailableConversions();
      expect(logErrorSpy).toHaveBeenCalledWith('error - Some error');
      expect(result).toEqual([]);
      logErrorSpy.mockRestore();
    });
  });

  describe('deleteVideo', () => {
    it('should prompt user to delete video and send delete request if user confirms', async () => {
      const videoName = 'video.mp4';
      const path = `media/${videoName}`;
      const SUCCESS_CODES = [200, 202, 204];
      const mockResponse = {status: 204};

      (host.delete as jest.Mock).mockResolvedValueOnce(mockResponse);

      const mockAskQ = jest.spyOn(Alert, "askQuestion");
      mockAskQ.mockImplementationOnce((_, callback) => {
        // @ts-ignore
        callback()
      });

      await player.deleteVideo(videoName);
      expect(mockAskQ).toHaveBeenCalled();
      expect(mockAskQ).toHaveBeenCalledWith(`Delete video "${videoName}?"`, expect.any(Function));
      expect(host.delete).toHaveBeenCalledWith(path);
      expect(SUCCESS_CODES).toContain(mockResponse.status);
    });

    it('should not send delete request if user does not confirm', async () => {
      const videoName = 'video.mp4';
      const mockAskQ = jest.spyOn(Alert, "askQuestion").mockImplementationOnce((_, callback) => {
      });
      await player.deleteVideo(videoName);
      expect(mockAskQ).toHaveBeenCalledWith(`Delete video "${videoName}?"`, expect.any(Function));
      expect(host.delete).not.toHaveBeenCalled();
    });

    it('should log error if delete request fails', async () => {
      const videoName = 'video.mp4';
      const path = `media/${videoName}`;
      const mockResponse = {status: 400, statusText: 'Bad Request'};
      (host.delete as jest.Mock).mockResolvedValueOnce(mockResponse);
      const mockAskQ = jest.spyOn(Alert, "askQuestion").mockImplementationOnce((_, callback) => {
      });
      await player.deleteVideo(videoName);
      expect(mockAskQ).toHaveBeenCalledWith(`Delete video "${videoName}?"`, expect.any(Function));
      expect(host.delete).not.toHaveBeenCalled();
    });
  });
});