/**
 * The Task state
 * @typedef {Object} TaskState
 * @property {string} displayName - The display name of the task
 */

/**
 * The Constants used in the application
 * @typedef {Object} Constants
 * @property {string} LI_STYLE - The style definition for list item of the task list
 * @property {string} UL_STYLE - The style definition for unordered list of task list
 */

/**
 * The Props for TaskTab Component
 * @typedef {Object} TaskTabProps
 * @property {RestAdaptor} host - The rest adaptor
 * @property {boolean} isActive - Defines if the task is active
 */

/**
 * Function that loads the list of TaskState and listens to any changes via web sockets
 * @param {TaskTabProps} props - The task tab props
 * @returns {JSX.Element} - The component element
 */
export const TasksTab = (props: TaskTabProps) => {

  const [downloadResults, setDownloadResults] = useState([] as TaskState[]);

  useEffect(() => {
    
    if (props.isActive) {
      const taskManager = new TaskManager(props.host);

    /**
    * Async function that loads the tasks and the repeat interval of tasks 
    * @async
    */
      (async () => {
        await taskManager.list(setDownloadResults);
      })();

    /**
    * The setInterval function that updates the tasks every 2 seconds
    */
      const interval = setInterval(async () => {
        await taskManager.list(setDownloadResults);
      }, 2000);

      return () => clearInterval(interval);
    }

  }, [props.isActive, props.host]);

 /**
 * Function that handles the click event on an item in the task list
 * and deletes the selected item from the list
 * @param {TaskState} item - The clicked task
 */
  const onItemClick = async (item: TaskState) => {
    const taskManager = new TaskManager(props.host);
    await taskManager.delete(item);
  }

 /**
 * The props for TaskList component
 * @typedef {Object} TaskListProps
 * @property {TaskState[]} results - The list of tasks to display
 * @property {((item: TaskState)=>void)} onItemClick - The click handler for task item
 */

 /**
 * The TaskList component that displays the task list
 * @param {TaskListProps} props - The task list props
 * @returns {JSX.Element} - The component element
 */

  return (
    <div className="p-0">
      <TaskList results={downloadResults} onItemClick={onItemClick}/>
    </div>
  )
}

/**
 * The TaskList component that displays the task list
 * @param {TaskListProps} props - The task list props
 * @returns {JSX.Element} - The component element
 */
const TaskList = (props: TaskListConfig) => {

/**
* The variable downloadingItems as an array of li elements representing tasks
*/
  const downloadingItems = props.results.map((result: TaskState, idx: number, arr:TaskState[]) => {
    let classes = LI_STYLE;
    if (idx !== arr.length - 1) {
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