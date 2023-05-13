import {RestAdaptor} from "../adaptors/RestAdaptor";

/**
 * Represents a message that can be sent to a remote server.
 *
 * @interface
 */
export class RemotePlayerState {
  readonly currentTime: number;
  readonly duration: number;
  readonly currentSrc: string;
  readonly collection: string;
  readonly video: string;

  constructor(player: HTMLVideoElement, collection: string, video: string) {
    this.currentTime = player.currentTime;
    this.duration = player.duration;
    this.currentSrc = player.currentSrc;
    this.collection = collection;
    this.video = video;
  }
}

/**
 * Represents a message that can be sent from the remote server.
 *
 * @interface
 */
export interface RemoteMessage {
  Play?: PlayRequest; // A PlayRequest used to request audio or video playback.
  Stop?: string; // Request audio or video stop.
  TogglePause?: string; // Toggle audio or video pause.
  Command?: {command: string}; // A string command that can be sent to a remote server.
  Seek?: {interval: number}; // An interval of time that can be sent to seek audio or video playback.
  State?: RemotePlayerState;
  Error?: string;
}


/**
 * Represents a request for audio or video playback.
 *
 * @interface
 */
export interface PlayRequest {
  url: string; // The URL to audio or video media.
  collection: string;
  video: string;
}

/**
 * Represents a remote command that can be sent to a server.
 *
 * @class
 */
export class RemoteCommand {
  /**
   * The remote address of the server to which the command will be sent.
   *
   * @type {string}
   */
  remote_address: string = "";

  /**
   * The message that will be sent to the server.
   *
   * @type {RemoteMessage}
   */
  message: RemoteMessage;

  /**
   * Creates a RemoteCommand instance.
   *
   * @constructor
   * @param {RemoteMessage} message - The message to be sent.
   * @param {string} [remote_address] - The remote address of the server.
   */
  constructor(message: RemoteMessage, remote_address?: string) {
    this.message = message;
    if (remote_address !== undefined) {
      this.remote_address = remote_address;
    }
  }
}

/**
 * Represents a video entry returned from a search result.
 *
 * @class
 */
export class CollectionDetails {
  /**
   * The name of the video's collection.
   *
   * @type {string}
   */
  collection: string = "";

  /**
   * The name of the parent collection of the video.
   *
   * @type {string}
   */
  parent_collection: string = "";

  /**
   * An array of child collections of the video.
   *
   * @type {string[]}
   */
  child_collections: string[] = [];

  /**
   * An array of videos.
   *
   * @type {string[]}
   */
  videos: string[] = [];

  /**
   * An array of error messages.
   *
   * @type {string[]}
   */
  errors: string[] = [];
}

export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  audioTracks: number;
}

export interface SeriesDetails {
  seriesTitle: string;
  season: string;
  episode: string;
  episodeTitle: string;
}

class VideoParseError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = "VideoParseError";
  }
}

export interface VideoDetails {
  video: string;
  collection: string;
  description: string;
  series: SeriesDetails;
  thumbnail: string; // Assuming PathBuf is serialized to a string
  metadata: VideoMetadata;
}

/*
export class VideoDetails {
  name: string = "";
  image?: string;
  lengthMinutes: number = 0;
  description?: string;
}*/


export interface MediaDetails {
  Collection?: CollectionDetails; // A PlayRequest used to request audio or video playback.
  Video?: VideoDetails; // Request audio or video stop.
  Error?: string;
}

/**
 * Represents a search engine.
 *
 * @enum {string}
 */
export enum SearchEngine {
  YouTube = "youtube",
  PirateBay = "piratebay",
}

/**
 * Represents a search result.
 *
 * @class
 */
export class SearchResult {
  /**
   * The title of the search result.
   *
   * @type {string}
   */
  readonly title: string;

  /**
   * The description of the search result.
   *
   * @type {string}
   */
  readonly description: string;

  /**
   * The link of the search result.
   *
   * @type {string}
   */
  readonly link: string;

  /**
   * The search engine used to generate the result.
   *
   * @type {SearchEngine}
   */
  readonly engine: SearchEngine;

  /**
   * Creates a SearchResult instance.
   *
   * @constructor
   * @param {string} title - The title of the search result.
   * @param {string} description - The description of the search result.
   * @param {string} link - The link of the search result.
   * @param {SearchEngine} engine - The search engine used to generate the result.
   */
  constructor(title: string, description: string, link: string, engine: SearchEngine) {
    this.title = title;
    this.description = description;
    this.link = link;
    this.engine = engine;
  }
}

/**
 * Represents a message containing search results.
 *
 * @template T
 * @interface
 */
export interface ResultsMessage<T> {
  results: T[] | null;
  error: string | null;
}

/**
 * Represents a message containing search results for {@link SearchResult}.
 *
 * @type {ResultsMessage<SearchResult>}
 */
export type SearchResultsMessage = ResultsMessage<SearchResult>;

/**
 * Represents a general response from a server.
 *
 * @interface
 */
export interface GeneralResponse {
  message: string;
  errors: string[];
}

/**
 * Represents a host configuration for a {@link RestAdaptor}.
 *
 * @interface
 */
export type HostConfig = {
  host: RestAdaptor;
}

/**
 * Represents the type of a task.
 *
 * @enum {string}
 */
export enum TaskType {
  Transmission = "transmission",
  AsyncProcess = "asyncprocess",
}

/**
 * Represents the state of a task.
 *
 * @interface
 */
export interface TaskState {
  key: string;
  name: string;
  displayName: string;
  finished: boolean;
  eta: number;
  percentDone: number;
  sizeDetails: string;
  rateDetails: string;
  processDetails: string;
  errorString: string;
  taskType: TaskType;
}

/**
 * Represents a message containing a list of {@link TaskState}.
 *
 * @type {ResultsMessage<TaskState>}
 */
export type TaskListResponse = ResultsMessage<TaskState>;

/**
 * Represents a conversion that can be performed.
 *
 * @interface
 */
export interface Conversion {
  name: string;
  description: string;
}

/**
 * Represents a message containing a list of {@link Conversion}.
 *
 * @type {ResultsMessage<Conversion>}
 */
export type ConversionListMessage = ResultsMessage<Conversion>;

/**
 * Represents a request to perform a conversion.
 *
 * @class
 */
export class ConversionRequest {
  /**
   * The name of the conversion to be performed.
   *
   * @type {string}
   */
  private readonly name: string;

  /**
   * Creates a ConversionRequest instance.
   *
   * @constructor
   * @param {string} name - The name of the conversion.
   */
  constructor(name: string) {
    this.name = name;
  }
}

/**
 * Represents a request to rename something.
 *
 * @class
 */
export class RenameRequest {
  /**
   * The new name to set.
   *
   * @type {string}
   */
  private readonly newName: string;

  /**
   * Creates a RenameRequest instance.
   *
   * @constructor
   * @param {string} newName - The new name to set.
   */
  constructor(newName: string) {
    this.newName = newName;
  }
}