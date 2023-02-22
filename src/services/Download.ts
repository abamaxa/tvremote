import {RestAdaptor} from "../adaptors/RestAdaptor";
import {DownloadingItem} from "../domain/Messages";
import {log_error, log_warning} from "./Logger";
import { DownloadingResponse } from "../domain/Messages";

export type setDownloadingList = ((items: DownloadingItem[]) => void);

export interface DownloadService {
  list: ((callback: setDownloadingList) => void);
  add: ((link: string) => void);
  delete: ((id: string) => void);
}

export class DownloadManager implements DownloadService {
  private readonly host: RestAdaptor;

  constructor(host: RestAdaptor) {
    this.host = host;
  }

  list(callback: setDownloadingList) {
    this.host.get("downloads/list")
      .then((res) => res.json())
      .then((data: DownloadingResponse) => {
        if (data.results !== null) {
          callback(data.results);
        } else if (data.error !== null) {
          log_warning(data.error);
        }
      })
      .catch((err) => {
        log_error(err)
      });
  }

  add(link: string) {
    this.host.post("downloads/add", {link: link}).catch((err) => {
      log_error(err)
      alert(err);
    });
  }

  delete(id: string) {
    this.host.delete("downloads/delete/" + id).catch((err) => {
      log_error(err)
      alert(err);
    });
  }

}