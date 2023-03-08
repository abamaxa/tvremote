import {RestAdaptor} from "../adaptors/RestAdaptor";
import {DownloadingItem, SearchResult} from "../domain/Messages";
import {log_error, log_warning} from "./Logger";
import { DownloadingResponse } from "../domain/Messages";

export type setDownloadingList = ((items: DownloadingItem[]) => void);

export interface DownloadService {
  list: ((callback: setDownloadingList) => void);
  add: ((link: SearchResult) => void);
  delete: ((id: string) => void);
}

export class DownloadManager implements DownloadService {
  private readonly host: RestAdaptor;

  constructor(host: RestAdaptor) {
    this.host = host;
  }

  async list(callback: setDownloadingList) {
    try {
      const data: DownloadingResponse = await this.host.get("downloads");
      if (data.results !== null) {
        callback(data.results);
      } else if (data.error !== null) {
        log_warning(data.error);
      }
    } catch (error) {
      log_error(error);
    }
  }

  async add(item: SearchResult) {
    try {
      await this.host.post(
        "downloads",
        {link: item.link, engine: item.engine}
      );
    } catch (error) {
      log_error(error);
    }
  }

  async delete(id: string) {
    try {
      await this.host.delete("downloads/" + id);
    } catch(error) {
      log_error(error);
    }
  }
}