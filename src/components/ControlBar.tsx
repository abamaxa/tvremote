/**
 * React Component that renders the control bar for the player.
 * @param {ControlBarProps} props - The props object for the ControlBar component.
 * @returns {JSX.Element} - Returns the JSX element for the ControlBar component.
 */
import React from "react";
import {Player} from "../services/Player";
import {Button} from "flowbite-react";
import {HiArrowLeftCircle, HiArrowRightCircle, HiPlayPause} from "react-icons/hi2";
import {IconBaseProps} from "react-icons";

type ControlBarProps = {
  player: Player;
  video?: string;
}

export const ControlBar = (props: ControlBarProps) => {
  const player = props.player;
  /**
   * The ControlButton items in the ControlBar component.
   * @returns {JSX.Element} - Returns the JSX element for the ControlButton items in the ControlBar.
   */
  const video = props?.video
  let buttons;
  if (video !== undefined) {
    buttons = (
      <ControlButton onClick={() => player.playVideo(video)} iconClass={HiPlayPause} />
    )
  } else {
    buttons = (
      <>
        <ControlButton onClick={() => player.seek(-15)} iconClass={HiArrowLeftCircle} />
        <ControlButton onClick={() => player.togglePause()} iconClass={HiPlayPause} />
        <ControlButton onClick={() => player.seek(15)} iconClass={HiArrowRightCircle} />
      </>
    )
  }

  return (
    <div className="flex gap-6 p-2 w-full items-center justify-center rounded-b-lg border-t bg-gray-50">
      { buttons }
    </div>
  )
}

type ControlButtonProps = {
  children?: React.ReactNode;
  ariaLabel?: string;
  onClick: () => void;
  iconClass:  React.FunctionComponent<IconBaseProps>;
}

/**
 * React component that renders a control button to be used in the ControlBar.
 * @param {ControlButtonProps} props - The props object for the ControlButton component.
 * @returns {JSX.Element} - Returns the JSX element for the ControlButton component.
 */
export const ControlButton = (props: ControlButtonProps) => {
  const icon = React.createElement(props.iconClass, {color: "gray", className: "h-6 w-6"});
  /**
   * Handles the click event on the ControlButton component.
   * @returns {void} - Returns nothing.
   */
  const handleClick = (): void => {
    props.onClick();
  };
  return (
    <Button color="gray" className="border-gray-700" outline={true} pill={true} onClick={() => handleClick()}>
      {icon}
    </Button>
  )
}