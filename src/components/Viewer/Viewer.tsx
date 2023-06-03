import React, {useEffect, useRef, useState} from "react";
import {log_info, log_warning} from "../../services/Logger";
import {SocketAdaptor} from "../../adaptors/Socket";
import {PlayRequest, RemoteMessage, RemotePlayerState} from "../../domain/Messages";
import {RestAdaptor} from "../../adaptors/RestAdaptor";
import VideoTab from "../Video/VideoTab";
import {VideoPlayer} from "../../services/Player";

type VideoControlProps = {
  host: RestAdaptor;
}

const Viewer = (props: VideoControlProps) => {

  const [socket, setSocket] = useState<SocketAdaptor | null>(null);
  const [currentVideo, setCurrentVideo] = useState<PlayRequest>();
  const [currentCollection, setCurrentCollection] = useState<string>("");
  const videoControlRef = useRef(null);

  const videoPlayer = new VideoPlayer(currentCollection, setCurrentCollection, props.host, "");

  useEffect(() => {
    const host = props.host.getHost() ? props.host.getHost() : location.host;
    const _socket = new SocketAdaptor(
      () => new WebSocket(`ws://${host}/api/remote/ws`),
      (message: RemoteMessage) => {
        if (message.Play !== undefined) {
          setCurrentVideo(message.Play);

        } else if (message.Seek !== undefined && videoControlRef !== null) {
          const vc = videoControlRef.current as unknown as HTMLVideoElement;
          vc.currentTime = vc.currentTime + message.Seek.interval;

        } else if (message.TogglePause !== undefined && videoControlRef !== null) {
          const vc = videoControlRef.current as unknown as HTMLVideoElement;
          togglePause(vc);
        }
      }
    );

    setSocket(_socket);

  }, [props.host]);

  const togglePause = (vc: HTMLVideoElement) => {
    if (vc.paused) {
      vc.play().catch(err => {
        log_warning(err.message);
      })
    } else {
      vc.pause();
    }
  };

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const vc = e.currentTarget as unknown as HTMLVideoElement;
    togglePause(vc);
  }

  const getNextVideo = (_: React.SyntheticEvent<HTMLVideoElement>) => {
    log_info("getNextVideo called");
  }

  const logVideoError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const error = (e.target as HTMLVideoElement).error;
    if (error) {
      log_info(`Video error: ${error.message}`);
    }
  }

  const onKeyPressed = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    log_info(`keyPress: ${e.key}, code: ${e.code}`);
  }

  const onTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (socket !== null && currentVideo !== undefined) {
      const player = e.currentTarget as HTMLVideoElement;
      socket.send({State: new RemotePlayerState(player, currentVideo.collection, currentVideo.video)});
    }
  }

  const showVideoDetails = (name: string) => {
    console.log(`video: ${name}`);
    videoPlayer.playVideo(name);
  }

  if (currentVideo !== undefined) {
    // onClick={e => onClick(e)}
    return (
        <div className="bg-black h-screen w-screen">
          <video
            className="m-auto w-full h-screen object-contain outline-0"
            onEnded={e => getNextVideo(e)}
            onError={e => logVideoError(e)}
            onTimeUpdate={e => onTimeUpdate(e)}
            id="video"
            autoPlay={true}
            controls
            muted={false}
            playsInline={false}
            src={currentVideo.url}
            ref={videoControlRef}
          >
          </video>
        </div>
    )
  } else {
    return (
      <div className="bg-black h-screen w-screen flex">
        <div className="p-1 mx-auto overflow-y-auto w-1/2">
          <VideoTab
            videoPlayer={videoPlayer}
            isActive={true}
            showVideoDetails={showVideoDetails}
          />
        </div>
      </div>
    )
  }
};

export default Viewer;