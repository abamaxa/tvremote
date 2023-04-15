import React, {useEffect, useRef, useState} from "react";
import {log_info, log_warning} from "../src/services/Logger";
import {SocketAdaptor} from "../src/adaptors/Socket";
import {RemoteMessage} from "../src/domain/Messages";
import {RestAdaptor} from "../src/adaptors/RestAdaptor";

type VideoControlProps = {
  host: RestAdaptor;
}

const VideoControlPage = (props: VideoControlProps) => {

  const [currentVideo, setCurrentVideo] = useState("");
  const videoControlRef = useRef(null);

  useEffect(() => {
    const host = props.host.getHost() ? props.host.getHost() : location.host;
    const socket = new SocketAdaptor(
      () => new WebSocket(`ws://${host}/remote/ws`),
      (message: RemoteMessage) => {
        if (message.Play !== undefined) {
          setCurrentVideo(message.Play.url);

        } else if (message.Seek !== undefined && videoControlRef !== null) {
          const vc = videoControlRef.current as unknown as HTMLVideoElement;
          vc.currentTime = vc.currentTime + message.Seek.interval;

        } else if (message.TogglePause !== undefined && videoControlRef !== null) {
          const vc = videoControlRef.current as unknown as HTMLVideoElement;
          togglePause(vc);
        }
      }
    );

  }, [props.host])

  /*const playFullScreen = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video: HTMLVideoElement = e.currentTarget;
    video.requestFullscreen().then(r => log_info(`requestFullscreen: ${r}`)).catch(r => log_info(`failed: ${r}`));
    video.className ="w-full";
  }*/

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
    // const vc = videoControlRef.current as unknown as HTMLVideoElement;
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

  if (currentVideo != "") {
    // onClick={e => onClick(e)}
    return (
        <div className="bg-black h-screen w-screen">
          <video
            className="m-auto w-full h-screen object-contain outline-0"
            onEnded={e => getNextVideo(e)}
            onError={e => logVideoError(e)}
            id="video"
            autoPlay={true}
            controls
            muted={false}
            playsInline={false}
            src={currentVideo}
            ref={videoControlRef}
          >
          </video>
        </div>
    )
  } else {
    return (
      <h1 className="text-6xl text-white bg-black text-center h-screen py-32">
        Ready
      </h1>
    )
  }
};

export default VideoControlPage;