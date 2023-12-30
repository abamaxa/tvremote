import { Player } from "../../services/Player";
import {Dropdown, Progress} from "flowbite-react";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {ConvertModal, Modals} from "./Modals";
import {RemoteMessage} from "../../domain/Messages";
import {secondsToHMSString} from "../../services/helpers";
import {ControlBar} from "../ControlBar";
import {log_error} from "../../services/Logger";
import {VideoDetailsImpl} from "../../domain/Models";

const HIDE_DIALOG = (<></>);


type VideoDetailProps = {
  video?: string;
  collection?: string;
  player: Player;
  setDialog: Dispatch<SetStateAction<JSX.Element>>;
  lastMessage ? : RemoteMessage;
  back: (() => void);
}

class VideoPropsWrapper {
  readonly video?: string;
  readonly collection?: string;
  readonly player: Player;
  readonly setDialog: Dispatch<SetStateAction<JSX.Element>>;
  readonly lastMessage ? : RemoteMessage;
  readonly back: (() => void);

  constructor(props: VideoDetailProps) {
    if (typeof props.lastMessage !== "undefined") {
      this.lastMessage = props.lastMessage;
    }

    if (this.name() !== props.video) {
      this.video = props.video;
      this.collection = props.collection;
    }

    this.player = props.player;
    this.setDialog = props.setDialog;
    this.back = props.back;
  }

  name = (): string => {
    if (typeof this.video !== "undefined") {
      return this.video;
    }

    if (typeof this.lastMessage?.State !== "undefined") {
      return this.lastMessage.State.video;
    }

    return "???";
  }

  getCollection = (): string => {
    if (typeof this.collection !== "undefined") {
      return this.collection;
    }

    if (typeof this.lastMessage?.State !== "undefined") {
      return this.lastMessage.State.collection;
    }

    return "???";
  }

  getDetails = async (): Promise<VideoDetailsImpl | null> => {
    try {
      let result = await this.player.fetchDetails(this.name(), this.getCollection());
      if (typeof result.Video !== "undefined") {
        return new VideoDetailsImpl(result.Video);
      }
    } catch (error) {
      log_error(error, `getDetails: ${this.name()}, ${this.getCollection()}`);
    }

    return null;
  }

  getUrl = (): string => {
    /*
    this is a hack, we need the server to send the full url of the file to download 
    as the host with the media may not be the same as the host serving this app. 
    
    Also this code breaks if the root url changes 
    */
    const collection = this.getCollection();
    const downloadRoot = "/api/stream";

    if (collection !== "") {
      return `${downloadRoot}/${collection}/${this.name()}`;
    }

    return `${downloadRoot}/${this.name()}`;
  }

  showProgress = (): boolean => {
    const state = this.lastMessage?.State;

    if (!state) {
      return false;
    }

    return state.video == this.name() && state.collection == this.getCollection()
  }
}

export const VideoItemDetail = (_props: VideoDetailProps) => {
  const [videoDetails, setVideoDetails] = useState<VideoDetailsImpl | null>(null);
  const props = new VideoPropsWrapper(_props);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const details: VideoDetailsImpl | null = await props.getDetails();
        setVideoDetails(details);
      } catch (error) {
        log_error(error, "fetchData");
      }
    };

    fetchData();

  }, [_props.video, _props.collection]);

  const description = () => {
    if (props.showProgress()) {
      return (<PlayerProgress message={props.lastMessage} />);
    }
    return getDescription(videoDetails);
  };

  return(
    <div className="max-w-screen-md border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="p-2">
        <a href="#">
          <img
            className="mx-auto object-cover h-full w-52 rounded-lg"
            src={`/api/thumbnails/${videoDetails?.thumbnail}`}
            alt={`image from ${props.name()}`}
          />
        </a>
        <div className="mt-2">
          <div className="float-right" >
            <VideoMenu {...props} />
          </div>

          <a href="#">
            <h5 className="mb-2 font-bold tracking-tight text-gray-900 dark:text-white">
              {props.name()}
            </h5>
          </a>

          <div className="mb-3 font-medium text-sm text-gray-700 dark:text-gray-400">
          { description() }
          </div>
        </div>
      </div>
      {/* Render the video player control bar */}
      <ControlBar player={props.player} video={props.video} />
    </div>
  )
}


const getDescription = (videoDetails: VideoDetailsImpl | null) => {

  try {
    return (
      <div>
        <p>Duration: {videoDetails?.getDuration() || "?"}</p>
        <p>Size: {videoDetails?.getSize() || "?"}</p>
      </div>
    );
  } catch(error) {
    log_error(error, `getDescription: ${videoDetails}`);
    return (
      <div>
        { JSON.stringify(error) }
      </div>
    )
  }

}

/*
  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
  <div className="h-2 mb-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
 */
export const PlayerProgress = (props: {message?: RemoteMessage}) => {

  const playerState = props.message?.State;
  if (typeof playerState === "undefined") {
    return (<></>);
  }

  const percent_done = playerState.currentTime * 100 / playerState.duration;
  const time_str = secondsToHMSString(playerState.currentTime);
  const duration_str = secondsToHMSString(playerState.duration);
  const progress =  `${ time_str } / ${ duration_str }`;

  return (
    <div className="flex flex-col">
      <p className="mb-2">{progress}</p>
      <Progress labelText={false} progress={percent_done} />
    </div>);
}

export const VideoMenu = (props: VideoPropsWrapper) => {

  return (
    <Dropdown label="..."  placement="left-start" arrowIcon={false} inline={true}>
      <Dropdown.Item onClick={() => showRenameModal(props)}>
        Rename
      </Dropdown.Item>
      <Dropdown.Item onClick={() => showConvertModal(props)}>
        Convert...
      </Dropdown.Item>
      <Dropdown.Item onClick={() => downloadVideo(props)}>
        Download
      </Dropdown.Item>
      <Dropdown.Item onClick={() => deleteVideo(props)}>
        Delete
      </Dropdown.Item>
    </Dropdown>
  )
}

/**
 * A function that shows the rename modal.
 * @param {VideoItemArgs} props - The arguments for the VideoItem component.
 * @returns {void}
 */
const showRenameModal = (props: VideoPropsWrapper) => {
  const onClose = () => props.setDialog(HIDE_DIALOG);

  const renameDialog = (
    <Modals onClose={onClose} video={props.name()} player={props.player} />
  );

  props.setDialog(renameDialog);
}

/**
 * A function that shows the convert modal.
 * @param {VideoPropsWrapper} props - The arguments for the VideoItem component.
 * @returns {void}
 */
const showConvertModal = (props: VideoPropsWrapper) => {
  const onClose = () => props.setDialog(HIDE_DIALOG);

  const convertModal = (
    <ConvertModal onClose={onClose} video={props.name()} player={props.player} />
  );

  props.setDialog(convertModal);
}

/**
 * A function that plays the video.
 * @param {VideoPropsWrapper} props - The arguments for the VideoItem component.
 * @returns {void}
 */
const playVideo = (props: VideoPropsWrapper) => {
  props.player.playVideo(props.name());
}

/**
 * A function that deletes the video.
 * @param {VideoPropsWrapper} props - The arguments for the VideoItem component.
 * @returns {void}
 */
const deleteVideo = (props: VideoPropsWrapper) => {
  props.player.deleteVideo(props.name(), props.back);
}

const downloadVideo = (props: VideoPropsWrapper): void => {

  if (typeof props.video !== "undefined") {
    // Create a new link
    const anchor = document.createElement('a');

    anchor.download = props.video;
    anchor.href = props.getUrl();

    // Append to the DOM
    document.body.appendChild(anchor);

    // Trigger `click` event
    anchor.click();

    // Remove element from DOM
    document.body.removeChild(anchor);
  }
}
