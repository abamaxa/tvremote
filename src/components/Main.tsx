import {Button} from "flowbite-react";
import VideoTab from "./Video/VideoTab";
import {SearchTab} from "./Search/SearchTab";
import {TasksTab} from "./Tasks/TasksTab";
import {HostConfig} from "../domain/Messages";
import React, {useReducer, useState} from "react";
import {HiCloudDownload, HiSearch, HiVideoCamera} from "react-icons/hi";
import {ControlBar} from "./ControlBar";
import {VideoPlayer} from "../services/Player";
import {Alert, gAlertManager} from "./Base/Alert";
import {SE_PIRATEBAY} from "../domain/Constants";
import {reducer, State} from "./Search/Reducer"
import {IconBaseProps} from "react-icons";

// The initial state for the search reducer.
const initialState: State = {
  term: "",
  engine: SE_PIRATEBAY,
  results: [],
  lastSearch: "",
}

/**
 * The main component of the application.
 * @param {HostConfig} props - The host configuration.
 */
export const Main = (props: HostConfig) => {
  const [currentCollection, setCurrentCollection] = useState<string>("");
  const [activeTab, setActiveTab] = useState<number>(0);
  const [alertVisible, setAlertVisible] = useState<boolean>(false);

  // Use the reducer with the initial state for the search results.
  // @ts-ignore
  const [state, dispatch] = useReducer(reducer, initialState);

  const videoPlayer = new VideoPlayer(currentCollection, setCurrentCollection, props.host, "");

  // Determine which component to render based on the active tab.
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

  // Set the alert visibility state based on the global alert manager.
  gAlertManager.setStateFunction(setAlertVisible);

  return (
    <div className="flex flex-col h-fill-viewport w-full">
      {/* Render the global alert component. */}
      <Alert show={alertVisible}/>
      
      {/* Render the tab buttons */}
      <div className="flex flex-row flex-wrap items-center p-1 w-full">
        <TabButton name="Play" tabNumber={0} activeTab={activeTab} setActiveTab={setActiveTab} iconClass={HiVideoCamera} />
        <TabButton name="Find" tabNumber={1} activeTab={activeTab} setActiveTab={setActiveTab} iconClass={HiSearch} />
        <TabButton name="Tasks" tabNumber={2} activeTab={activeTab} setActiveTab={setActiveTab} iconClass={HiCloudDownload} />
      </div>
      
      {/* Render the selected main component*/}
      <div className="mb-auto p-1 overflow-y-auto">
        { mainComponent }
      </div>
      
      {/* Render the video player control bar */}
      <ControlBar player={videoPlayer} />
      
    </div>
  )
}

/**
 * The props for the tab button components.
 * @typedef {Object} TabButtonProps
 * @property {function} setActiveTab - A callback function to set the active tab.
 * @property {number} activeTab - The current active tab number.
 * @property {number} tabNumber - The tab button number.
 * @property {React.FunctionComponent} iconClass - The icon for the tab button.
 * @property {string} name - The name of the tab button.
 */
type TabButtonProps = {
  setActiveTab: ((tabNumber: number) => void);
  activeTab: number;
  tabNumber: number;
  iconClass:  React.FunctionComponent<IconBaseProps>;
  name: string;
}

/**
 * A component for the tab buttons.
 * @param {TabButtonProps} props - The properties of the tab button.
 */
const TabButton = (props: TabButtonProps) => {
  // Set the icon and button color based on the active tab.
  const iconColor = props.activeTab === props.tabNumber ? "white" : "gray";
  const buttonColor = props.activeTab === props.tabNumber ? "info" : "gray";

  // Create the icon element.
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