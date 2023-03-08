import {RestAdaptor} from "../adaptors/RestAdaptor";
import {GeneralResponse, RemoteCommand, RemoteMessage, VideoEntry} from "../domain/Messages";
import {log_error} from "./Logger";
import {showInfoAlert} from "../components/Alert";

export interface Player {
  playVideo: (video: string) => void;
  fetchCollection: () => Promise<VideoEntry>;
  seek: ((interval: number) => void);
  togglePause: (() => void);
  setCurrentCollection: ((newCollection: string) => void);
  getCurrentCollection: (() => string);
}

export class VideoPlayer implements Player {

  private readonly currentCollection: string;
  private readonly host: RestAdaptor;
  private readonly remote_address?: string;
  private readonly setCurrentCollectionHook: ((newCollection: string) => void);

  constructor(currentCollection: string, setCurrentCollectionHook: ((newCollection: string) => void), host: RestAdaptor, remote_address?: string) {
    this.currentCollection = currentCollection;
    this.host = host;
    this.remote_address = remote_address;
    this.setCurrentCollectionHook = setCurrentCollectionHook;
  }

  setCurrentCollection = (newCollection: string) => {
    this.setCurrentCollectionHook(newCollection);
  }
  getCurrentCollection = (): string =>  {
    return this.currentCollection;
  }

  playVideo = (video: string) => {
    const msg = {
      remote_address: this.remote_address,
      collection: this.currentCollection,
      video: video
    };

    this.post('remote/play', msg);
  }

  seek = (interval: number) => {
    const msg: RemoteMessage = {Seek: {interval: interval}}
    const command = new RemoteCommand(msg);
    this.post('remote/control', command);
  }

  togglePause = () => {
    const msg: RemoteMessage = {TogglePause: "ok"};
    const command = new RemoteCommand(msg);
    this.post('remote/control', command);
  }

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

  fetchCollection = async (): Promise<VideoEntry> => {
    const path = this.currentCollection ? "media/" + this.currentCollection : "media";
    return await this.host.get(path);
  }
}