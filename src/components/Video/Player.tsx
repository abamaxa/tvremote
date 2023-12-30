import { SocketAdaptor } from "@/adaptors/Socket";
import { PlayRequest, RemotePlayerState } from "@/domain/Messages";
import { log_info, log_warning } from "@/services/Logger";
import { forwardRef, useImperativeHandle, useRef } from "react";

export enum PlayState {
  STOPPED = 1,
  PAUSED,
  STARTED
}

type PlayerProps = {
  currentVideo: PlayRequest;
  socket: SocketAdaptor | null; 
  onStateChange: (newState: PlayState) => void;
};

export interface PlayerHandlers {
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
}

// eslint-disable-next-line react/display-name
const Player = forwardRef<PlayerHandlers, PlayerProps>((props, ref) => {

  const videoControlRef = useRef(null);

  useImperativeHandle(ref, () => {
    const vc = videoControlRef.current as unknown as HTMLVideoElement;
  
    return ({
      play: () => {
        vc.play();
      },
      pause: () => {
        if (vc.paused) {
          vc.play().catch(err => {
            log_warning(err.message);
          })
        } else {
          vc.pause();
        }
      },
      stop: () => {
        if (vc) {
          vc.pause();
          vc.currentTime = 0;
        }
      },
      seek: (time: number) => {
        if (vc) {
          vc.currentTime = vc.currentTime + time;
        }
      }
    })
  });

  const getNextVideo = (_: React.SyntheticEvent<HTMLVideoElement>) => {
    log_info("getNextVideo called");
  };

  const logVideoError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const error = (e.target as HTMLVideoElement).error;
    if (error) {
      log_info(`Video error: ${error.message}`);
    }
  };

  const onKeyPressed = (e: React.KeyboardEvent<HTMLElement>) => {
    e.preventDefault();
    log_info(`keyPress: ${e.key}, code: ${e.code}`);
  };

  const onTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (props.socket !== null && typeof props.currentVideo !== "undefined") {
      const player = e.currentTarget as HTMLVideoElement;
      props.socket.send({
        State: new RemotePlayerState(
          player,
          props.currentVideo.collection,
          props.currentVideo.video
        ),
      });
    }
  };

  return (
    <div className="bg-black h-screen w-screen absolute">
      <video
        className="m-auto w-full h-screen object-contain outline-0"
        onEnded={(e) => getNextVideo(e)}
        onError={(e) => logVideoError(e)}
        onTimeUpdate={(e) => onTimeUpdate(e)}
        onKeyDown={(e) => onKeyPressed(e)}
        onKeyDownCapture={(e) => onKeyPressed(e)}
        onEndedCapture={(_) => props.onStateChange(PlayState.STOPPED)}
        onPause={(_) => props.onStateChange(PlayState.PAUSED)}
        onPlayCapture={(_) => props.onStateChange(PlayState.STARTED)}
        id="video"
        autoPlay={true}
        controls
        muted={false}
        playsInline={false}
        src={props.currentVideo.url}
        ref={videoControlRef}
      ></video>
    </div>
  );
});

export default Player;