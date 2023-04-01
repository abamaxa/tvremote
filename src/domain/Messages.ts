import {RestAdaptor} from "../adaptors/RestAdaptor";

/**
 * Represents a message that can be sent to a remote server.
 */
export interface RemoteMessage {
  Play?: PlayRequest; // A PlayRequest used to request audio or video playback.
  Stop?: string; // Request audio or video stop.
  TogglePause?: string; // Toggle audio or video pause.
  Command?: {command: string}; // A string command that can be sent to a remote server.
  Seek?: {interval: number}; // An interval of time that can be sent to seek audio or video playback.
}

/**
 * Represents a request for audio or video playback.
 */
export interface PlayRequest {
  url: string; // The URL to audio or video media.
}

export class RemoteCommand {
  remote_address: string = "";
  message: RemoteMessage;

  constructor(message: RemoteMessage, remote_address?: string) {
    this.message = message;
    if (remote_address !== undefined) {
      this.remote_address = remote_address;
    }
  }
}

export class VideoEntry {
  collection: string = "";
  parent_collection: string = "";
  child_collections: string[] = [];
  videos: string[] = [];
  errors: string[] = [];
}

export enum SearchEngine {
  YouTube = "youtube",
  PirateBay = "piratebay",
}


export class SearchResult {
  readonly title: string;
  readonly description: string;
  readonly link: string;
  readonly engine: SearchEngine;

  constructor(title: string, description: string, link: string, engine: SearchEngine) {
    this.title = title;
    this.description = description;
    this.link = link;
    this.engine = engine;
  }
}

export interface ResultsMessage<T> {
  results: T[] | null;
  error: string | null;
}

export type SearchResultsMessage = ResultsMessage<SearchResult>;

export interface GeneralResponse {
  message: string;
  errors: string[];
}

export type HostConfig = {
  host: RestAdaptor;
}

export enum TaskType {
  Transmission = "transmission",
  AsyncProcess = "asyncprocess",
}


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

export type TaskListResponse = ResultsMessage<TaskState>;

export interface Conversion {
  name: string;
  description: string;
}

export type ConversionListMessage = ResultsMessage<Conversion>;

export class ConversionRequest {
  private readonly name: string;

  constructor(name: string) {
    this.name = name;
  }
}

export class RenameRequest {
  private readonly newName: string;

  constructor(newName: string) {
    this.newName = newName;
  }
}