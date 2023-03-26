import {Button} from "flowbite-react";
import VideoTab from "./Video/VideoTab";
import {SearchTab} from "./Search/SearchTab";
import {TasksTab} from "./Tasks/TasksTab";
import {HostConfig} from "../domain/Messages";
import React, {ReactNode, useReducer, useState} from "react";
import {HiCloudDownload, HiSearch, HiVideoCamera} from "react-icons/hi";
import {ControlBar} from "./ControlBar";
import {VideoPlayer} from "../services/Player";
import {Alert, gAlertManager} from "./Base/Alert";
import {SE_PIRATEBAY} from "../domain/Constants";
import {reducer, State} from "./Search/Reducer"
import {IconBaseProps} from "react-icons";

const initialState: State = {
  term: "",
  engine: SE_PIRATEBAY,
  results: [],
  lastSearch: "",
}

export const Main = (props: HostConfig) => {
  const [currentCollection, setCurrentCollection] = useState("");
  const [activeTab, setActiveTab] = useState<number>(0);
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  // @ts-ignore
  const [state, dispatch] = useReducer(reducer, initialState);

  const videoPlayer = new VideoPlayer(currentCollection, setCurrentCollection, props.host, "");

  const mainComponent = (() => {
    switch (activeTab) {
      case 1:
        return (<SearchTab host={props.host} state={state} dispatch={dispatch} />);
      case 2:
        return (<TasksTab host={props.host} isActive={true} />);
      default:
        return (<VideoTab host={props.host} videoPlayer={videoPlayer} isActive={true} />);
    }
  })();

  gAlertManager.setStateFunction(setAlertVisible);

  return (
    <div className="flex flex-col h-fill-viewport w-full">
      <Alert show={alertVisible}/>
      <div className="flex flex-row flex-wrap items-center p-1 w-full">
        <TabButton name="Play" tabNumber={0} activeTab={activeTab} setActiveTab={setActiveTab} iconClass={HiVideoCamera} />
        <TabButton name="Find" tabNumber={1} activeTab={activeTab} setActiveTab={setActiveTab} iconClass={HiSearch} />
        <TabButton name="Tasks" tabNumber={2} activeTab={activeTab} setActiveTab={setActiveTab} iconClass={HiCloudDownload} />
      </div>
      <div className="mb-auto p-1 overflow-y-auto">
        { mainComponent }
      </div>
      <ControlBar player={videoPlayer} />
    </div>
  )
}

type TabButtonProps = {
  setActiveTab: ((tabNumber: number) => void);
  activeTab: number;
  tabNumber: number;
  iconClass:  React.FunctionComponent<IconBaseProps>;
  name: string;
}

const TabButton = (props: TabButtonProps) => {
  const iconColor = props.activeTab === props.tabNumber ? "white" : "gray";
  const buttonColor = props.activeTab === props.tabNumber ? "info" : "gray";

  const icon = React.createElement(props.iconClass, {color: iconColor, className: "mr-2 h-4 w-4"});

  return (
    <Button
      color={buttonColor}
      size="sm"
      outline={false}
      className="grow"
      onClick={() => props.setActiveTab(props.tabNumber)}
    >
      {icon}
      {' '}{props.name}
    </Button>
  )
}
