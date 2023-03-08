import {Button} from "flowbite-react";
import VideoTab from "./VideoTab";
import {SearchTab} from "./SearchTab";
import {DownloadTab} from "./DownloadTab";
import {HostConfig} from "../domain/Messages";
import {useState} from "react";
import {HiCloudDownload, HiSearch, HiVideoCamera} from "react-icons/hi";
import {ControlBar} from "./ControlBar";
import {VideoPlayer} from "../services/Player";
import {Alert, gAlertManager} from "./Alert";

export const Main = (props: HostConfig) => {
  const [currentCollection, setCurrentCollection] = useState("");
  const [activeTab, setActiveTab] = useState<number>(0);
  const [alertVisible, setAlertVisible] = useState<boolean>(false);

  const videoPlayer = new VideoPlayer(currentCollection, setCurrentCollection, props.host, "");

  const mainComponent = (() => {
    switch (activeTab) {
      case 1:
        return (<SearchTab host={props.host} />);
      case 2:
        return (<DownloadTab host={props.host} isActive={true} />);
      default:
        return (<VideoTab host={props.host} videoPlayer={videoPlayer} />);
    }
  })();

  gAlertManager.setStateFunction(setAlertVisible);

  return (
    <div className="flex flex-col h-screen justify-between w-full">
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
          {' '}...
        </Button>
      </Button.Group>
      <div className="mb-auto p-1 overflow-y-auto">
        { mainComponent }
      </div>
      <ControlBar player={videoPlayer} />
    </div>
  )
}
