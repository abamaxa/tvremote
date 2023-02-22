import {RestAdaptor} from "../adaptors/RestAdaptor";
import {RemoteCommand, RemoteMessage} from "../domain/Messages";

export interface Player {

  playVideo: (video: string) => void;
  fetchCollection: () => Promise<Response>;
  seek: ((interval: number) => void);
  togglePause: (() => void);
}

export class VideoPlayer implements Player {

  private readonly currentCollection: string;
  private readonly host: RestAdaptor;
  private remote_address?: string;

  constructor(currentCollection: string, host: RestAdaptor, remote_address?: string) {
    this.currentCollection = currentCollection;
    this.host = host;
    this.remote_address = remote_address;
  }

  playVideo = (video: string) => {
    const msg = {
      remote_address: this.remote_address,
      collection: this.currentCollection,
      video: video
    };

    this.post('remote-play', msg);
  }

  seek = (interval: number) => {
    const msg: RemoteMessage = {Seek: {interval: interval}}
    const command = new RemoteCommand(msg);
    this.post('remote-control', command);
  }

  togglePause = () => {
    const msg: RemoteMessage = {TogglePause: "ok"};
    const command = new RemoteCommand(msg);
    this.post('remote-control', command);
  }

  post = (path: string, params?: object | RemoteCommand) => {
    this.host.post(path, params)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
      })
      .catch((err) => {
        console.error(err)
        alert(err);
      });
  }

  fetchCollection = (): Promise<Response> => {
    const path = this.currentCollection ? 'videos/' + this.currentCollection : "collections";
    return this.host.get(path);
  }
}