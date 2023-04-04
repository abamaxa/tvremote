import { TaskState } from "../../domain/Messages";
import { ReactNode } from "react";

/**
 * Props for displaying the details of a task
 */
type TaskDetailsProps = {
  result: TaskState; // The result of the task
  index: number; // The index of the task 
}

/**
 * Displays the details of a task 
 * @param {TaskDetailsProps} props - The props object for TaskDetails
 * @return {JSX.Element} The JSX representing TaskDetails 
 */
export const TaskDetails = (props: TaskDetailsProps): JSX.Element => {
  let details: ReactNode[] = [];
  const result = props.result;
  const idx = props.index;
  
  // If the task is finished, display "Finished" 
  if (result.finished) {
    return (<TaskDetail detail="Finished" key={"done:" + idx} />);
  }
  
  // If the task contains size details, include in details array 
  if (result.sizeDetails) {
    details.push((<TaskDetail label="Size" detail={result.sizeDetails} key={"size:" + idx} />));
  }
  
  // If the task contains ETA details, include the ETA and percent done in the details array 
  if (result.eta) {
    const timeString = secondsToTimeString(result.eta);
    const detail = `${timeString} (${(result.percentDone * 100).toFixed(2)}%)`;
    details.push((<TaskDetail label="Eta" detail={detail} key={"eta:" + idx} />));
  }
  
  // If the task contains rate details, include in details array 
  if (result.rateDetails) {
    details.push((<TaskDetail label="Rate" detail={result.rateDetails} key={"rate:" + idx} />));
  }
  
  // If the task contains process details, include in details array 
  if (result.processDetails) {
    details.push((<TaskDetail detail={result.processDetails} key={"proc:" + idx} />));
  }
  
  // Return the details array 
  return (<>{details}</>);
}

/**
 * Props object for displaying a single task detail 
 */
type TaskDetailProps = {
  label?: string; // The label for the detail 
  detail: string; // The detail to display 
}

/**
 * Displays a single task detail 
 * @param {TaskDetailProps} props - The props object for TaskDetail 
 * @return {JSX.Element} The JSX representing TaskDetail 
 */
export const TaskDetail = (props: TaskDetailProps): JSX.Element => {
  // Use an empty label if undefined is passed 
  const label = props.label === undefined ? "" : `${props.label}: `;
  
  // Return the JSX for a single task detail 
  return (
    <p className="text-gray-600 text-xs">
      {label}
      {props.detail}&nbsp;
    </p>
  )
}

/**
 * Converts the given number of seconds into a formatted time string
 * @param {number} secs - The number of seconds to convert 
 * @return {string} The formatted time string 
 */
export const secondsToTimeString = (secs: number): string => {
  // Return "unknown" if input is zero or negative 
  if (secs <= 0) {
    return "unknown";
  }
  
  // Define the time intervals used in the formatted time string 
  const intervals = [
    {period: "day", divisor: 24 * 3600},
    {period: "hour", divisor: 3600},
    {period: "min", divisor: 60},
    {period: "sec", divisor: 1}
  ];
  
  // Initialize an array to store the time parts 
  const parts: string[] = [];
  
  // Calculate the time parts 
  for (let interval of intervals) {
    const part = Math.floor(secs / interval.divisor);
    secs = secs % interval.divisor;
    if (part !== 0) {
      const name = part > 1 ? interval.period + "s" : interval.period;
      parts.push(`${part} ${name}`);
    }
  }
  
  // Join the time parts and return the formatted time string 
  return parts.join(" ");
}