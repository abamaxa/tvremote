import {RestAdaptor} from "../adaptors/RestAdaptor";
import {
  Conversion,
  ConversionListMessage, ConversionRequest,
  GeneralResponse,
  RemoteCommand,
  RemoteMessage, RenameRequest,
  MediaDetails, VideoDetails
} from "../domain/Messages";
import {log_error} from "./Logger";
import {showInfoAlert, askQuestion} from "../components/Base/Alert";
import {StatusCodes} from "../domain/Constants";

/**
 * @interface Player
 * An interface for a video player. Defines methods for playing videos, managing collections, and editing videos
 */
export interface Player {
  playVideo: (video: VideoDetails) => void;
  fetchDetails: (video? :string, collection?: string) => Promise<MediaDetails>;
  seek: ((interval: number) => void);
  togglePause: (() => void);
  setCurrentCollection: ((newCollection: string) => void);
  getCurrentCollection: (() => string);
  deleteVideo: (video: string, onSuccess?: (() => void)) => void;
  renameVideo: (video: string, newName: string) => void;
  convertVideo: (video: string, conversion: string) => void;
  getAvailableConversions: () => Promise<Conversion[]>;
}

/**
 * @class VideoPlayer
 * A class that implements the Player interface for playing and managing videos with the help of the RestAdaptor class
 */
export class VideoPlayer implements Player {

  /**
   * @property {string} currentCollection The currently selected video collection
   * @property {RestAdaptor} host The REST API adapter for making calls to the server
   * @property {string | undefined} remote_address The IP address of the remote server for playing videos remotely
   * @property {function} setCurrentCollectionHook A hook function to set the current collection state
   */
  private readonly currentCollection: string;
  private readonly host: RestAdaptor;
  private readonly remote_address?: string;
  private readonly setCurrentCollectionHook: ((newCollection: string) => void);

  /**
   * @constructor
   * Constructs a new VideoPlayer object with the specified parameters
   * @param {string} currentCollection The current video collection
   * @param {function} setCurrentCollectionHook A hook function to set the current collection state
   * @param {RestAdaptor} host The REST API adapter for making calls to the server
   * @param {string} remote_address The IP address of the remote server for playing videos remotely
   */
  constructor(currentCollection: string, setCurrentCollectionHook: ((newCollection: string) => void), host: RestAdaptor, remote_address?: string) {
    this.currentCollection = currentCollection;
    this.host = host;
    this.remote_address = remote_address;
    this.setCurrentCollectionHook = setCurrentCollectionHook;
  }

  /**
   * @method getAvailableConversions
   * Returns a list of available video format conversions supported by the server
   * @returns {Promise<Conversion[]>} A promise that contains the list of available conversions
   */
  getAvailableConversions = async (): Promise<Conversion[]> => {
    let results: Conversion[] = [];
    try {
      let response: ConversionListMessage = await this.host.get(`conversion`);
      if (response.error) {
        log_error("conversions are unavailable: " + response.error);
      }
      results = response.results || [];
    } catch (error) {
      log_error(error, "VideoPlayer.getAvailableConversions");
    }
    return results;
  }

  /**
   * @method deleteVideo
   * Deletes the specified video from the current collection after confirmation from the user
   * @param {string} video The name of the video file to delete
   * @param onSuccess
   */
  deleteVideo = async (video: string, onSuccess?: (() => void)) => {
    const SUCCESS_CODES = [StatusCodes.OK, StatusCodes.ACCEPTED, StatusCodes.NO_CONTENT];
    askQuestion(`Delete video "${video}?"`, async () => {
      try {
        const videoPath = this.makePath(video);
        const response = await this.host.delete(`media/${videoPath}`);
        if (SUCCESS_CODES.findIndex((e) => e === response.status) === -1) {
          log_error(`cannot delete "${video}": "${response.statusText}"`);
        } else if (typeof onSuccess !== "undefined") {
          onSuccess();
        }
      } catch (error) {
        log_error(error, `deleteVideo: ${video}`);
      }
    });
  }

  /**
   * @method renameVideo
   * Renames the specified video file after confirmation from the user
   * @param {string} video The name of the video file to rename
   * @param {string} newName The new name to assign to the video file
   */
  renameVideo = async (video: string, newName: string) => {
    askQuestion(`rename video "${video}" to "${newName}"?`, async () => {
      try {
        const videoPath = this.makePath(video);
        const newPath = this.makePath(newName);
        const response = await this.host.put(`media/${videoPath}`, new RenameRequest(newPath));
        if (response.status !== StatusCodes.OK) {
          log_error(`cannot rename "${video}" to "${newName}": "${response.statusText}"`);
        }
      } catch (error) {
        log_error(error, `renameVideo: "${video}" to "${newName}"`);
      }
    });
  }

  /**
   * @method convertVideo
   * Converts the specified video to the specified format after confirmation from the user
   * @param {string} video The name of the video file to convert
   * @param {string} conversion The format to convert the video to
   */
  convertVideo = async (video: string, conversion: string) => {
    askQuestion(`${conversion} with "${video}"?`, async () => {
      try {
        const videoPath = this.makePath(video);
        const response = await this.host.post(`media/${videoPath}`, new ConversionRequest(conversion));
        if (response.status !== StatusCodes.OK) {
          log_error(`cannot convert "${video}": "${response.statusText}"`);
        }
      } catch (error) {
        log_error(error, `convertVideo: ${conversion} with "${video}"`);
      }
    });
  }

  /**
   * @method setCurrentCollection
   * Sets the current video collection
   * @param {string} newCollection The name of the new collection to set
   */
  setCurrentCollection = (newCollection: string) => {
    this.setCurrentCollectionHook(newCollection);
  }

  /**
   * @method getCurrentCollection
   * Gets the name of the current video collection
   * @returns {string} The name of the current collection
   */
  getCurrentCollection = (): string =>  {
    return this.currentCollection;
  }

  /**
   * @method playVideo
   * Plays the specified video using the remote server, if specified
   * @param {string} video The name of the video file to play
   */
  playVideo = (video: VideoDetails) => {
    const msg = {
      remoteAddress: this.remote_address,
      collection: this.currentCollection,
      video: video.video,
      width: video.metadata.width,
      height: video.metadata.height,
      aspectWidth: video.metadata.aspectWidth,
      aspectHeight: video.metadata.aspectHeight,
    };

    this.post('remote/play', msg);
  }

  /**
   * @method seek
   * Seeks the current video by the specified interval using the remote server, if specified
   * @param {number} interval The time interval to seek by, in seconds
   */
  seek = (interval: number) => {
    const msg: RemoteMessage = {Seek: {interval: interval}}
    const command = new RemoteCommand(msg);
    this.post('remote/control', command);
  }

  /**
   * @method togglePause
   * Pauses or resumes playback of the current video using the remote server, if specified
   */
  togglePause = () => {
    const msg: RemoteMessage = {TogglePause: "ok"};
    const command = new RemoteCommand(msg);
    this.post('remote/control', command);
  }

  /**
   * @method post
   * Sends an HTTP POST request to the specified path using the supplied parameters
   * @param {string} path The path to send the request to
   * @param {object | RemoteCommand} params The parameters to send with the request
   */
  post = async (path: string, params?: object | RemoteCommand) => {
    try {
      const response = await this.host.post(path, params);
      if (response.status !== StatusCodes.OK) {
        showInfoAlert(response.statusText);
        return;
      }
      const data: GeneralResponse = await response.json();
      if (data.errors.length > 0) {
        showInfoAlert(data.errors[0]);
      }
    }
    catch (err) {
      log_error(err, `post: ${path}`);
    }
  }

  /*
    post = (path: string, params?: object | RemoteCommand) => {
    this.host.post(path, params)
      .then((res) => res.json())
      .then((data: GeneralResponse) => {
        if (data.errors.length > 0) {
          showInfoAlert(data.errors[0]);
        }
      })
      .catch((err) => {
        log_error(err);
      });
  }
   */

  /**
   * @method fetchCollection
   * Fetches the current video collection from the server
   * @returns {Promise<CollectionDetails>} A promise that contains the fetch video collection data
   */
  fetchDetails = async (video? :string, collection?: string): Promise<MediaDetails> => {
    let path: string = "media";

    if (typeof collection !== "undefined" && collection) {
      path += "/" + collection;
    } else if (this.currentCollection) {
      path += "/" + this.currentCollection;
    }

    if (typeof video !== "undefined" && video) {
      path += "/" + video;
    }

    return await this.host.get(path);
  }

  /**
   * @method makePath
   * Constructs the path for the specified video file, taking into account any current collection
   * @param {string} video The name of the video file to construct a path for
   * @returns {string} The path to the specified video file
   */
  makePath = (video: string): string => {
    return this.currentCollection ? `${this.currentCollection}/${video}` : video;
  }
}