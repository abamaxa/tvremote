import { Player } from "../../services/Player";
import {Dropdown, Progress} from "flowbite-react";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {ConvertModal, Modals} from "./Modals";
import {RemoteMessage, VideoDetails} from "../../domain/Messages";
import {secondsToTimeString} from "../../services/helpers";
import {ControlBar} from "../ControlBar";
import {log_error} from "../../services/Logger";

const HIDE_DIALOG = (<></>);


type VideoDetailProps = {
  video?: string;
  collection?: string;
  player: Player;
  setDialog: Dispatch<SetStateAction<JSX.Element>>;
  lastMessage ? : RemoteMessage;
  back?: (() => void);
}

class VideoPropsWrapper {
  readonly video?: string;
  readonly collection?: string;
  readonly player: Player;
  readonly setDialog: Dispatch<SetStateAction<JSX.Element>>;
  readonly lastMessage ? : RemoteMessage;
  readonly back?: (() => void);

  constructor(props: VideoDetailProps) {
    if (props.lastMessage !== undefined) {
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
    if (this.video !== undefined) {
      return this.video;
    }

    if (this.lastMessage?.State !== undefined) {
      return this.lastMessage.State.video;
    }

    return "???";
  }

  getCollection = (): string => {
    if (this.collection !== undefined) {
      return this.collection;
    }

    if (this.lastMessage?.State !== undefined) {
      return this.lastMessage.State.collection;
    }

    return "???";
  }

  getDetails = async (): Promise<VideoDetails | null> => {
    try {
      let result = await this.player.fetchDetails(this.name(), this.getCollection());
      if (result.Video !== undefined) {
        return result.Video;
      }
    } catch (error) {
      log_error(error);
    }

    return null;
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
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const props = new VideoPropsWrapper(_props);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const details: VideoDetails | null = await props.getDetails();
        setVideoDetails(details);
      } catch (error) {
        log_error(error);
      }
    };

    fetchData();

  }, [_props.player, _props.video, _props.collection]);

  const getDescription = () => {
    const duration = videoDetails?.metadata.duration;
    const durationStr = secondsToTimeString(duration ? duration : 0);
    return (
      <>
        <p>{`Duration: ${durationStr}`}</p>
        <p>{`Size: ${videoDetails?.metadata.width}x${videoDetails?.metadata.height}`}</p>
      </>
    );
  }

  let description;
  if (props.showProgress()) {
    description = (
      <PlayerProgress message={props.lastMessage} />
    );
  } else {
    description = (
      <p className="mb-3 font-medium text-gray-700 dark:text-gray-400">
        {getDescription()}
      </p>
    );
  }

  return(
    <div className="max-w-screen-md border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="p-2">
        <a href="#">
          <img
            className="mx-auto object-cover h-full w-48 rounded-lg"
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
          { description }
        </div>
      </div>
      {/* Render the video player control bar */}
      <ControlBar player={props.player} video={props.video} />
    </div>
  )
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
  if (playerState == undefined) {
    return (<></>);
  }

  const percent_done = playerState.currentTime * 100 / playerState.duration;
  const time_str = secondsToTimeString(playerState.currentTime);
  const duration_str = secondsToTimeString(playerState.duration);
  const progress =  `${ time_str } / ${ duration_str }`;

  return (
    <Progress
      textLabel={progress}
      labelText={true}
      textLabelPosition="outside"
      progress={percent_done}
    />);
}

export const VideoMenu = (props: VideoPropsWrapper) => {
  return (
    <Dropdown label="..."  placement="left-start" arrowIcon={false} inline={true}>
      <Dropdown.Item onClick={() => playVideo(props)}>
        Play
      </Dropdown.Item>
      <Dropdown.Item onClick={() => showRenameModal(props)}>
        Rename
      </Dropdown.Item>
      <Dropdown.Item onClick={() => showConvertModal(props)}>
        Convert...
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
  props.setDialog(HIDE_DIALOG);
  props.player.playVideo(props.name());
}

/**
 * A function that deletes the video.
 * @param {VideoPropsWrapper} props - The arguments for the VideoItem component.
 * @returns {void}
 */
const deleteVideo = (props: VideoPropsWrapper) => {
  props.setDialog(HIDE_DIALOG);
  props.player.deleteVideo(props.name());
}
