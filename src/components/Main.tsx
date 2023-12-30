import VideoTab from "./Video/VideoTab";
import {SearchTab} from "./Search/SearchTab";
import {TasksTab} from "./Tasks/TasksTab";
import {HostConfig, RemoteMessage} from "../domain/Messages";
import React, {useEffect, useReducer, useState} from "react";
import {VideoPlayer} from "../services/Player";
import {Alert, gAlertManager} from "./Base/Alert";
import { CardModal } from "./Base/Modal"
import {SE_PIRATEBAY} from "../domain/Constants";
import {reducer, State} from "./Search/Reducer"
import {SocketAdaptor} from "../adaptors/Socket";
import {VideoItemDetail} from "./Video/VideoDetail";
import {SpeedDialer} from "./SpeedDialer";

// The initial state for the search reducer.
const initialState: State = {
  term: "",
  engine: SE_PIRATEBAY,
  results: [],
  lastSearch: "",
}

enum CardNames {
  Videos,
  CurrentVideo,
  Search,
  Tasks,
  VideoDetail,
}

/**
 * The main component of the application.
 * @param {HostConfig} props - The host configuration.
 */
export const Main = (props: HostConfig) => {
  const [currentCollection, setCurrentCollection] = useState<string>("");
  const [activeCard, setActiveCard] = useState<CardNames>(CardNames.Videos);
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [lastMessage, setLastMessage] = useState<RemoteMessage>();
  const [dialog, setDialog] = useState<JSX.Element>((<></>));
  const [videoName, setVideoName] = useState<string | null>(null);

  // Use the reducer with the initial state for the search results.
  // @ts-ignore
  const [state, dispatch] = useReducer(reducer, initialState);

  const videoPlayer = new VideoPlayer(currentCollection, setCurrentCollection, props.host, "");

  useEffect(() => {
    const host = props.host.getHost() ? props.host.getHost() : location.host;
    new SocketAdaptor(
      () => new WebSocket(`ws://${host}/api/control/ws`),
      (message: RemoteMessage) => {
        setLastMessage(message);
      }
    );
  }, [props.host]);

  const showVideoDetails = (name: string) => {
    setVideoName(name);
    setActiveCard(CardNames.VideoDetail);
  }

  // Determine which component to render based on the active tab.
  const getMainCard = () => {
    const onClose = () => setActiveCard(CardNames.Videos);

    switch (activeCard) {
      case CardNames.Search:
        return (
          <CardModal title={"Search"} onClose={onClose}>
            <SearchTab host={props.host} state={state} dispatch={dispatch} />
          </CardModal>
        );

      case CardNames.Tasks:
        return (
          <CardModal title="Running Tasks" onClose={onClose}>
            <TasksTab host={props.host} isActive={true} />
          </CardModal>
        );

      case CardNames.CurrentVideo:
        return (
          <CardModal title="Current Video" onClose={onClose}>
            <VideoItemDetail
              player={videoPlayer}
              setDialog={setDialog}
              lastMessage={lastMessage}
              back={onClose}
            />
          </CardModal>
        );

      case CardNames.VideoDetail:
        if (videoName !== null) {
          const onClose = () => {
            setVideoName(null);
            setActiveCard(CardNames.Videos);
          }

          return (
            <CardModal title="Video Details" onClose={onClose}>
              <VideoItemDetail
                video={videoName}
                collection={currentCollection}
                setDialog={setDialog}
                back={() => setVideoName(null)}
                player={videoPlayer}
                lastMessage={lastMessage}
              />
            </CardModal>
          );
        }
    }

    return (<></>);
  };

  // Set the alert visibility state based on the global alert manager.
  gAlertManager.setStateFunction(setAlertVisible);

  return (
    <div className="lg:container lg:mx-auto flex flex-col h-fill-viewport w-full">
      {/* Render the global alert component. */}
      <Alert show={alertVisible}/>

      { getMainCard() }

      { dialog }

      {/* Render the selected main component*/}
      <div className="p-1 overflow-y-auto">
        <VideoTab
          videoPlayer={videoPlayer}
          isActive={activeCard === CardNames.Videos}
          showVideoDetails={showVideoDetails}
        />
      </div>

      <SpeedDialer
        lastMessage={lastMessage}
        showCurrentVideo={() => setActiveCard(CardNames.CurrentVideo)}
        showSearch={() => setActiveCard(CardNames.Search)}
        showTasks={() => setActiveCard(CardNames.Tasks)}
      />
    </div>
  )
}
