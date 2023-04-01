/**
 * Describes the arguments of VideoItem component.
 * @interface VideoItemArgs
 * @property {boolean} isLast - A flag to determine if VideoItem is the last item in the list.
 * @property {string} name - The name of the video.
 * @property {Player} videoPlayer - The video player object.
 * @property {Dispatch<SetStateAction<JSX.Element>>} setDialog - The setter function for the dialog that appears on clicking a video.
 */

/**
 * Hides the dialog on closing.
 * @constant {JSX.Element} HIDE_DIALOG
 */

import {Dispatch, MouseEvent, SetStateAction} from "react";
import PopupMenu from "../Base/PopupMenu";
import {LI_STYLE} from "../../domain/Constants";
import {Player} from "../../services/Player";
import {ConvertModal, Modals} from "./Modals";

/**
 * A functional component that represents a single video item in the list of videos.
 * @param {VideoItemArgs} props - The arguments for the VideoItem component.
 * @returns A JSX Element containing a single video item.
 */
export const VideoItem = (props: VideoItemArgs) => {

  /**
   * An object that contains classes for the VideoItem.
   * @constant {string} classes
   */
  const classes = getClasses(props.isLast) + " text-gray-600"

  /**
   * The name of the video.
   * @constant {string} displayName
   */
  const displayName = props.name;

  /**
   * A function that shows the popup dialog on clicking a video item.
   * @param {MouseEvent<HTMLLIElement>} e - The mouse event object of clicking the video item.
   * @returns {void}
   */
  const showDialog = (e: MouseEvent<HTMLLIElement>) => {
    e.preventDefault();

    /**
     * An object that contains classes for popup menus.
     * @constant {string} itemClass
     */
    const itemClass = getPopupClasses(false);

    /**
     * The video player object.
     * @constant {Player} player
     */
    const player = props.videoPlayer;

    /**
     * The vertical scroll position of the parent element.
     * @constant {number} scrollTop
     */
    const scrollTop = e.currentTarget?.parentNode?.parentElement?.parentNode?.parentElement?.scrollTop;

    /**
     * The JSX element that creates the PopupMenu component.
     * @constant {JSX.Element} dialog
     */
    const dialog = (
      <PopupMenu target={e.currentTarget} closeMenu={() => props.setDialog(HIDE_DIALOG)} scrollTop={scrollTop}>
        <ul>
          <li onClick={() => playVideo(props)} className={itemClass + " rounded-t"}>Play</li>
          <li onClick={(e) => showRenameModal(e, props)} className={itemClass}>Rename</li>
          <li onClick={(e) => showConvertModal(e, props)} className={itemClass}>Convert...</li>
          <li onClick={() => deleteVideo(props)} className={getPopupClasses(true, "rounded-b")}>Delete</li>
        </ul>
      </PopupMenu>
    );

    props.setDialog(dialog);
  }

  return (
    <li
      className={classes}
      onClick={(e) => showDialog(e)}>
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

/**
 * A function that returns the CSS classes for the PopupMenu component.
 * @param {boolean} isLast - A flag to determine if PopupMenu is the last item in the list.
 * @param {string|undefined} extra - An optional string of extra CSS classes for the element.
 * @returns {string} A string containing the CSS classes.
 */
const getPopupClasses = (isLast: boolean, extra?: string): string => {
  let classes = LI_STYLE + " cursor-pointer hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white ";
  if (extra !== undefined) {
    classes += extra;
  }

  if (!isLast) {
    classes += " border-b";
  }
  return classes;
}

/**
 * A function that shows the rename modal.
 * @param {MouseEvent} e - The mouse event object of clicking the 'Rename' option.
 * @param {VideoItemArgs} props - The arguments for the VideoItem component.
 * @returns {void}
 */
const showRenameModal = (e: MouseEvent, props: VideoItemArgs) => {
  const onClose = () => props.setDialog(HIDE_DIALOG);

  const renameDialog = (
    <Modals onClose={onClose} video={props.name} player={props.videoPlayer} />
  );

  props.setDialog(renameDialog);
}

/**
 * A function that shows the convert modal.
 * @param {MouseEvent} e - The mouse event object of clicking the 'Convert' option.
 * @param {VideoItemArgs} props - The arguments for the VideoItem component.
 * @returns {void}
 */
const showConvertModal = (e: MouseEvent, props: VideoItemArgs) => {
  const onClose = () => props.setDialog(HIDE_DIALOG);

  const convertModal = (
    <ConvertModal onClose={onClose} video={props.name} player={props.videoPlayer} />
  );

  props.setDialog(convertModal);
}

/**
 * A function that plays the video.
 * @param {VideoItemArgs} props - The arguments for the VideoItem component.
 * @returns {void}
 */
const playVideo = (props: VideoItemArgs) => {
  props.setDialog(HIDE_DIALOG);
  props.videoPlayer.playVideo(props.name);
}

/**
 * A function that deletes the video.
 * @param {VideoItemArgs} props - The arguments for the VideoItem component.
 * @returns {void}
 */
const deleteVideo = (props: VideoItemArgs) => {
  props.setDialog(HIDE_DIALOG);
  props.videoPlayer.deleteVideo(props.name);
}