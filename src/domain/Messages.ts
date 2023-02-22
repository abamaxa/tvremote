import {RestAdaptor} from "../adaptors/RestAdaptor";

export interface PlayRequest {
  url: string;
}

export interface RemoteMessage {

  Play? : PlayRequest;

  Stop?: string;

  TogglePause?: string;

  Command?: {command: string};

  Seek?: {interval: number};
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


export class SearchResult {
  readonly title: string;
  readonly description: string;

  readonly link: string;

  constructor(title: string, description: string, link: string) {
    this.title = title;
    this.description = description;
    this.link = link;
  }
}

export interface ResultsMessage<T> {
  results: T[] | null;
  error: string | null;
}

export type SearchResultsMessage = ResultsMessage<SearchResult>;

export type HostConfig = {
  host: RestAdaptor;
}

export interface DownloadingItem {
  downloadFinished: boolean;
  downloadedSize: number;
  errorString: string;
  eta: number;
  id: number;
  leftUntilDone: number;
  name: string;
  peersConnected: number;
  peersGettingFromUs: number;
  peersSendingToUs: number;
  percentDone: number;
  rateDownload: number;
  rateUpload: number;
  totalSize: number;
}

export type DownloadingResponse = ResultsMessage<DownloadingItem>;
