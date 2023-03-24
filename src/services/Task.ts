import {RestAdaptor} from "../adaptors/RestAdaptor";
import {TaskState, SearchResult} from "../domain/Messages";
import {log_error, log_warning} from "./Logger";
import { TaskListResponse } from "../domain/Messages";
import {StatusCodes} from "../domain/Constants";
import {askQuestion} from "../components/Base/Alert";

export type setDownloadingList = ((items: TaskState[]) => void);

export interface TaskService {
  list: ((callback: setDownloadingList) => void);
  add: ((link: SearchResult) => void);
  delete: ((task: TaskState) => void);
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

  async delete(task: TaskState) {
    const SUCCESS_CODES = [StatusCodes.OK, StatusCodes.ACCEPTED, StatusCodes.NO_CONTENT];
    askQuestion(`Terminate task "${task.name}?"`, async () => {
      try {
        const response = await this.host.delete(`tasks/${task.taskType}/${task.key}`);
        if (SUCCESS_CODES.findIndex((e) => e === response.status) === -1) {
          log_error(`cannot terminate task "${task.name}": "${response.statusText}"`);
        }
      } catch (error) {
        log_error(error);
      }
    });
  }

}