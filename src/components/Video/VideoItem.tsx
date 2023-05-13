import {Player} from "../../services/Player";
import {Dispatch, SetStateAction} from "react";
import {VideoDetails} from "../../domain/Messages";
import {LI_STYLE} from "../../domain/Constants";

/**
 * Describes the arguments of VideoItem component.
 * @interface VideoItemArgs
 * @property {boolean} isLast - A flag to determine if VideoItem is the last item in the list.
 * @property {string} name - The name of the video.
 * @property {Player} videoPlayer - The video player object.
 * @property {Dispatch<SetStateAction<JSX.Element>>} setDialog - The setter function for the dialog that appears on clicking a video.
 */
type VideoItemArgs = {
  isLast: boolean;
  name: string;
  videoPlayer: Player;
  setVideoDetails: (name: string) => void;
}

export const VideoItem = (props: VideoItemArgs) => {

  const classes = getClasses(props.isLast) + " text-gray-600"
  const displayName = props.name;

  const showDialog = () => {
    props.setVideoDetails(props.name);
  }

  return (
    <li
      className={classes}
      onClick={(_) => showDialog()}>
      <div>{displayName}</div>
    </li>
  );
}

/**
 * A function that returns the CSS classes for the VideoItem component.
 * @param {boolean} isLast - A flag to determine if VideoItem is the last item in the list.
 * @returns {string} A string containing the CSS classes.
 */
const getClasses = (isLast: boolean): string => {
  let classes = LI_STYLE;
  if (!isLast) {
    classes += " border-b";
  }
  return classes;
}
