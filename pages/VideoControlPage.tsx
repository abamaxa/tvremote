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
          if (vc.paused) {
            vc.play().catch(err => {
              log_warning(err.message);
            })
          } else {
            vc.pause();
          }
        }
      }
    );

  }, [props.host])

  const playFullScreen = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video: HTMLVideoElement = e.currentTarget;
    video.requestFullscreen().then(r => log_info(`requestFullscreen: ${r}`)).catch(r => log_info(`failed: ${r}`));
    video.className ="w-full";
  }

  const getNextVideo = (_: React.SyntheticEvent<HTMLVideoElement>) => {
    log_info("getNextVideo called");
  }

  if (currentVideo != "") {
    return (
      <div className="bg-black h-screen w-screen">
        <video
          className="h-screen m-auto"
          onLoadedMetadata={e => playFullScreen(e)}
          onEnded={e => getNextVideo(e)}
          style={{objectFit: "contain"}}
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
    return (<p>Waiting for video to be selected</p>)
  }
};

export default VideoControlPage;