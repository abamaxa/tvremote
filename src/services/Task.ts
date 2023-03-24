import {RestAdaptor} from "../adaptors/RestAdaptor";
import {TaskState, SearchResult} from "../domain/Messages";
import {log_error, log_warning} from "./Logger";
import { TaskListResponse } from "../domain/Messages";

export type setDownloadingList = ((items: TaskState[]) => void);

export interface TaskService {
  list: ((callback: setDownloadingList) => void);
  add: ((link: SearchResult) => void);
  delete: ((id: string) => void);
}

export class TaskManager implements TaskService {
  private readonly host: RestAdaptor;

  constructor(host: RestAdaptor) {
    this.host = host;
  }

  async list(callback: setDownloadingList) {
    try {
      const data: TaskListResponse = await this.host.get("tasks");
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
        "tasks",
        {name: item.title, link: item.link, engine: item.engine}
      );
    } catch (error) {
      log_error(error);
    }
  }

  async delete(id: string) {
    try {
      await this.host.delete("tasks/" + id);
    } catch(error) {
      log_error(error);
    }
  }
}