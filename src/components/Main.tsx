import {Button} from "flowbite-react";
import VideoTab from "./Video/VideoTab";
import {SearchTab} from "./Search/SearchTab";
import {TasksTab} from "./Tasks/TasksTab";
import {HostConfig} from "../domain/Messages";
import {useReducer, useState} from "react";
import {HiCloudDownload, HiSearch, HiVideoCamera} from "react-icons/hi";
import {ControlBar} from "./ControlBar";
import {VideoPlayer} from "../services/Player";
import {Alert, gAlertManager} from "./Base/Alert";
import {SE_PIRATEBAY} from "../domain/Constants";
import {reducer, State} from "./Search/Reducer"

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
    <div className="flex flex-col h-fill-viewport justify-between w-full">
      <Alert show={alertVisible}/>
      <Button.Group className="p-1 w-full">
        <Button color="gray" className="w-full" onClick={() => setActiveTab(0)}>
          <HiVideoCamera className="mr-2 h-4 w-4" />
          {' '}Play
        </Button>
        <Button color="gray" className="w-full" onClick={() => setActiveTab(1)}>
          <HiSearch className="mr-2 h-4 w-4" />
          {' '}Find
        </Button>
        <Button color="gray" className="w-full" onClick={() => setActiveTab(2)}>
          <HiCloudDownload className="mr-2 h-4 w-4" />
          {' '}Tasks
        </Button>
      </Button.Group>
      <div className="mb-auto p-1 overflow-y-auto">
        { mainComponent }
      </div>
      <ControlBar player={videoPlayer} />
    </div>
  )
}
