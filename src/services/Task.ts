/**
 * This module provides a TaskService and TaskManager class for interfacing with a REST API.
 * It imports RestAdaptor, TaskState, TaskListResponse, SearchResult, log_error, log_warning,
 * and StatusCodes from other modules, and exports setDownloadingList and TaskService types,
 * as well as the TaskManager class implementing the TaskService interface.
 * 
 * @module TaskManager
 */

import {RestAdaptor} from "../adaptors/RestAdaptor";
import {TaskState, TaskListResponse, SearchResult} from "../domain/Messages";
import {log_error, log_warning} from "./Logger";
import {StatusCodes} from "../domain/Constants";
import {askQuestion} from "../components/Base/Alert";

// Define custom types

/**
 * Callback function type for setting the currently downloading list of TaskStates.
 * Takes an array of TaskStates as argument and returns nothing.
 * 
 * @callback setDownloadingList
 * @param {TaskState[]} items
 * @returns {void}
 */

/**
 * TaskService interface defines methods for listing, adding, and deleting tasks.
 * 
 * @interface TaskService
 */

/**
 * Method for listing tasks, takes a callback of type setDownloadingList as argument.
 * Calls the callback with an array of TaskStates returned by the host and logs any errors.
 * 
 * @function list
 * @memberof TaskService
 * @param {setDownloadingList} callback
 * @returns {Promise<void>}
 */

/**
 * Method for adding a new task, takes a SearchResult object as argument.
 * Posts the SearchResult's name, link, and engine to the host and logs any errors.
 * 
 * @function add
 * @memberof TaskService
 * @param {SearchResult} item
 * @returns {Promise<void>}
 */

/**
 * Method for deleting a task, takes a TaskState object as argument.
 * Asks for confirmation before deleting the task by calling a confirmation popup.
 * Sends a DELETE request to the host with the taskType and key of the TaskState and logs any errors.
 * 
 * @function delete
 * @memberof TaskService
 * @param {TaskState} task
 * @returns {Promise<void>}
 */

export type setDownloadingList = ((items: TaskState[]) => void);

export interface TaskService {
  list: ((callback: setDownloadingList) => void);
  add: ((link: SearchResult) => void);
  delete: ((task: TaskState) => void);
}

export class TaskManager implements TaskService {
  /**
   * A class for implementing the TaskService interface.
   * 
   * @class TaskManager
   * @implements {TaskService}
   * @param {RestAdaptor} host - Interface for connecting to a REST API.
   */

  private readonly host: RestAdaptor;

  constructor(host: RestAdaptor) {
    this.host = host;
  }

  async list(callback: setDownloadingList) {
    /**
     * Retrieves a list of tasks from the host and passes it to a callback function.
     * Logs any errors encountered while retrieving the tasks.
     * 
     * @function list
     * @memberof TaskManager
     * @param {setDownloadingList} callback - Function to receive the list of tasks.
     * @returns {Promise<void>}
     */

    try {
      const data: TaskListResponse = await this.host.get("tasks");
      if (data.results !== null) {
        callback(data.results);
      } else if (data.error !== null) {
        log_warning(data.error);
      }
    } catch (error) {
      log_error(error, "list");
    }
  }

  async add(item: SearchResult) {
    /**
     * Adds a new task to the host.
     * Sends a POST request with the SearchResult's name, link, and engine to the host.
     * Logs any errors encountered while adding the task.
     * 
     * @function add
     * @memberof TaskManager
     * @param {SearchResult} item - SearchResult object representing the task to add.
     * @returns {Promise<void>}
     */

    try {
      await this.host.post(
        "tasks",
        {name: item.title, link: item.link, engine: item.engine}
      );
    } catch (error) {
      log_error(error, "TaskManager.add");
    }
  }

  async delete(task: TaskState) {
    /**
     * Deletes a task from the host.
     * Asks for confirmation before deleting and logs any errors encountered.
     * 
     * @function delete
     * @memberof TaskManager
     * @param {TaskState} task - TaskState object representing the task to delete.
     * @returns {Promise<void>}
     */

    const SUCCESS_CODES = [StatusCodes.OK, StatusCodes.ACCEPTED, StatusCodes.NO_CONTENT];
    askQuestion(`Terminate task "${task.name}?"`, async () => {
      try {
        const response = await this.host.delete(`tasks/${task.taskType}/${task.key}`);
        if (SUCCESS_CODES.findIndex((e) => e === response.status) === -1) {
          log_error(`cannot terminate task "${task.name}": "${response.statusText}"`);
        }
      } catch (error) {
        log_error(error, "TaskManager.delete");
      }
    });
  }
}