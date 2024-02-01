import React, {useEffect, useRef, useState} from "react";
import {SocketAdaptor} from "../../adaptors/Socket";
import {PlayRequest, RemoteMessage, VideoDetails} from "../../domain/Messages";
import {RestAdaptor} from "../../adaptors/RestAdaptor";
import VideoTab from "../Video/VideoTab";
import {VideoPlayer} from "@/services/Player";
import Player, { PlayState, PlayerHandlers } from '@/components/Video/Player';

type VideoControlProps = {
  host: RestAdaptor;
}

const Viewer = (props: VideoControlProps) => {

  const [socket, setSocket] = useState<SocketAdaptor | null>(null);
  const [showVideoSelection, setShowVideoSelection] = useState<Boolean>(true);
  const [currentVideo, setCurrentVideo] = useState<PlayRequest>();
  const [currentCollection, setCurrentCollection] = useState<string>("");
  const videoControlRef = useRef<PlayerHandlers | null>(null);

  const videoPlayer = new VideoPlayer(currentCollection, setCurrentCollection, props.host, "");

  useEffect(() => {
    const host = props.host.getHost() ? props.host.getHost() : location.host;
    const _socket = new SocketAdaptor(
      () => new WebSocket(`ws://${host}/api/remote/ws`),
      (message: RemoteMessage) => {
        if (typeof message.Play !== "undefined") {
          setCurrentVideo(message.Play);

        } else if (typeof message.Seek !== "undefined" && videoControlRef !== null) {
          videoControlRef.current?.seek(message.Seek.interval);

        } else if (typeof message.TogglePause !== "undefined" && videoControlRef !== null) {
          videoControlRef.current?.pause();

        }
      }
    );

    setSocket(_socket);

  }, [props.host]);

  const showVideoDetails = (video: VideoDetails) => {
    console.log(`video: ${video.video}`);
    videoPlayer.playVideo(video);
  }

  const onStateChange = (newState: PlayState) => {
    switch (newState) {
      case PlayState.STARTED:
        setShowVideoSelection(false);
        break;
      default:
        setShowVideoSelection(true);
    }
  }

  let player = (<></>);
  let videos = (<></>);

  if (typeof currentVideo !== "undefined") {
    player = (
      <Player 
        currentVideo={currentVideo} 
        socket={socket} 
        ref={videoControlRef} 
        onStateChange={onStateChange}
      />
    )
  } 

  console.log(`render: ${showVideoSelection}`)

  if (showVideoSelection) {
    videos = (
      <div className="p-1 mx-auto overflow-y-auto w-1/2 z-10">
        <VideoTab
          videoPlayer={videoPlayer}
          isActive={true}
          showVideoDetails={showVideoDetails}
        />
      </div>
    );
  }

  return (
    <div className="bg-black h-screen w-screen flex">
      {player}
      {videos}
    </div>
  )
};

export default Viewer;