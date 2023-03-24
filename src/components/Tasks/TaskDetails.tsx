import {TaskState} from "../../domain/Messages";
import {ReactNode} from "react";

type TaskDetailsProps = {
  result: TaskState;
  index: number;
}

export const TaskDetails = (props: TaskDetailsProps) => {
  let details: ReactNode[] = [];
  const result = props.result;
  const idx = props.index;

  if (result.finished) {
    return (<TaskDetail detail="Finished" key={"done:" + idx} />);
  }

  if (result.sizeDetails) {
    details.push((<TaskDetail label="Size" detail={result.sizeDetails} key={"size:" + idx} />));
  }

  if (result.eta) {
    const timeString = secondsToTimeString(result.eta);
    const detail = `${timeString} (${(result.percentDone * 100).toFixed(2)}%)`;
    details.push((<TaskDetail label="Eta" detail={detail} key={"eta:" + idx} />));
  }

  if (result.rateDetails) {
    details.push((<TaskDetail label="Rate" detail={result.rateDetails} key={"rate:" + idx} />));
  }

  if (result.processDetails) {
    details.push((<TaskDetail detail={result.processDetails} key={"proc:" + idx} />));
  }

  return (<>{details}</>);
}

type TaskDetailProps = {
  label?: string;
  detail: string;
}

export const TaskDetail = (props: TaskDetailProps) => {
  const label = props.label === undefined ? "" : `${props.label}: `;

  return (
    <p className="text-gray-600 text-xs">
      {label}{props.detail}&nbsp;
    </p>
  )
}

export const secondsToTimeString = (secs: number): string => {

  if (secs <= 0) {
    return "unknown";
  }

  const intervals = [
    {period: "day", divisor: 24 * 3600},
    {period: "hour", divisor: 3600},
    {period: "min", divisor: 60},
    {period: "sec", divisor: 1}
  ];

  const parts: string[] = [];

  for (let interval of intervals) {
    const part = Math.floor(secs / interval.divisor);
    secs = secs % interval.divisor;
    if (part !== 0) {
      const name = part > 1 ? interval.period + "s" : interval.period;
      parts.push(`${part} ${name}`)
    }
  }

  return parts.join(" ");
}