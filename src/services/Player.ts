import {RestAdaptor} from "../adaptors/RestAdaptor";
import {
  Conversion,
  ConversionListMessage, ConversionRequest,
  GeneralResponse,
  RemoteCommand,
  RemoteMessage, RenameRequest,
  VideoEntry
} from "../domain/Messages";
import {log_error} from "./Logger";
import {showInfoAlert, askQuestion} from "../components/Base/Alert";
import {StatusCodes} from "../domain/Constants";

export interface Player {
  playVideo: (video: string) => void;
  fetchCollection: () => Promise<VideoEntry>;
  seek: ((interval: number) => void);
  togglePause: (() => void);
  setCurrentCollection: ((newCollection: string) => void);
  getCurrentCollection: (() => string);
  deleteVideo: (video: string) => void;
  renameVideo: (video: string, newName: string) => void;
  convertVideo: (video: string, conversion: string) => void;
  getAvailableConversions: () => Promise<Conversion[]>;
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

  getAvailableConversions = async (): Promise<Conversion[]> => {
    let results: Conversion[] = [];
    try {
      let response: ConversionListMessage = await this.host.get(`conversion`);
      if (response.error) {
        log_error("conversions are unavailable: " + response.error);
      }
      results = response.results || [];
    } catch (error) {
      log_error(error);
    }
    return results;
  }

  deleteVideo = async (video: string) => {
    const SUCCESS_CODES = [StatusCodes.OK, StatusCodes.ACCEPTED, StatusCodes.NO_CONTENT];
    askQuestion(`Delete video "${video}?"`, async () => {
      try {
        const videoPath = this.makePath(video);
        const response = await this.host.delete(`media/${videoPath}`);
        if (SUCCESS_CODES.findIndex((e) => e === response.status) === -1) {
          log_error(`cannot delete "${video}": "${response.statusText}"`);
        }
      } catch (error) {
        log_error(error);
      }
    });
  }
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
        log_error(error);
      }
    });
  }

  convertVideo = async (video: string, conversion: string) => {
    askQuestion(`${conversion} with "${video}"?`, async () => {
      try {
        const videoPath = this.makePath(video);
        const response = await this.host.post(`media/${videoPath}`, new ConversionRequest(conversion));
        if (response.status !== StatusCodes.OK) {
          log_error(`cannot convert "${video}": "${response.statusText}"`);
        }
      } catch (error) {
        log_error(error);
      }
    });
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

  makePath = (video: string): string => {
    return this.currentCollection ? `${this.currentCollection}/${video}` : video;
  }
}