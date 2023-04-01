import {Dispatch, MouseEvent, SetStateAction} from "react";
import PopupMenu from "../Base/PopupMenu";
import {LI_STYLE} from "../../domain/Constants";
import {Player} from "../../services/Player";
import {ConvertModal, Modals} from "./Modals";

type VideoItemArgs = {
  isLast: boolean;
  name: string;
  videoPlayer: Player;
  setDialog: Dispatch<SetStateAction<JSX.Element>>;
}

const HIDE_DIALOG = (<></>);

export const VideoItem = (props: VideoItemArgs) => {

  const classes = getClasses(props.isLast) + " text-gray-600"
  const displayName = props.name;

  const showDialog = (e: MouseEvent<HTMLLIElement>) => {
    e.preventDefault();

    const itemClass = getPopupClasses(false);
    const player = props.videoPlayer;
    const scrollTop = e.currentTarget?.parentNode?.parentElement?.parentNode?.parentElement?.scrollTop;

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

const getClasses = (isLast: boolean): string => {
  let classes = LI_STYLE;
  if (!isLast) {
    classes += " border-b";
  }
  return classes;
}

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

const showRenameModal = (e: MouseEvent, props: VideoItemArgs) => {
  const onClose = () => props.setDialog(HIDE_DIALOG);

  const renameDialog = (
    <Modals onClose={onClose} video={props.name} player={props.videoPlayer} />
  );

  props.setDialog(renameDialog);
}

const showConvertModal = (e: MouseEvent, props: VideoItemArgs) => {
  const onClose = () => props.setDialog(HIDE_DIALOG);

  const convertModal = (
    <ConvertModal onClose={onClose} video={props.name} player={props.videoPlayer} />
  );

  props.setDialog(convertModal);
}

const playVideo = (props: VideoItemArgs) => {
  props.setDialog(HIDE_DIALOG);
  props.videoPlayer.playVideo(props.name);
}

const deleteVideo = (props: VideoItemArgs) => {
  props.setDialog(HIDE_DIALOG);
  props.videoPlayer.deleteVideo(props.name);
}