import {TaskState} from "../../domain/Messages";
import {LI_STYLE, UL_STYLE} from "../../domain/Constants";
import {useEffect, useState, MouseEvent, ReactNode} from "react";
import {TaskManager} from "../../services/Task";
import {RestAdaptor} from "../../adaptors/RestAdaptor";
import {TaskDetails} from "./TaskDetails";


type TaskTabProps = {
  host: RestAdaptor;
  isActive: boolean;
}

export const TasksTab = (props: TaskTabProps) => {

  const [downloadResults, setDownloadResults] = useState([] as TaskState[]);

  useEffect(() => {
    // TODO: push changes over websocket
    if (props.isActive) {
      const taskManager = new TaskManager(props.host);

      (async () => {
        await taskManager.list(setDownloadResults);
      })();

      const interval = setInterval(async () => {
        await taskManager.list(setDownloadResults);
      }, 2000);

      return () => clearInterval(interval);
    }

  }, [props.isActive, props.host]);

  const onItemClick = async (item: TaskState) => {
    const taskManager = new TaskManager(props.host);
    await taskManager.delete(item);
  }

  return (
    <div className="p-0">
      <TaskList results={downloadResults} onItemClick={onItemClick}/>
    </div>
  )
}

type TaskListConfig = {
  results: TaskState[];

  onItemClick: ((item: TaskState) => void);
};

const TaskList = (props: TaskListConfig) => {

  const downloadingItems = props.results.map((result: TaskState, idx: number, arr:TaskState[]) => {
    let classes = LI_STYLE;
    if (idx != arr.length - 1) {
      classes += " border-b";
    }


    return (
      <li className={classes} key={"search:" + idx} onClick={(e) => props.onItemClick(result)}>
        <p>{ result.displayName }</p>
        <TaskDetails result={result} index={idx} />
      </li>
    )
  })

  if (props.results.length == 0) {
    return (<p className="px-1 py-2">No results</p>);
  } else {
    return (<ul className={UL_STYLE}>{ downloadingItems }</ul>);
  }
}

