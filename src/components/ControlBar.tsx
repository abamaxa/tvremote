import React from "react";
import {Player} from "../services/Player";
import {Button} from "flowbite-react";
import {HiArrowLeftCircle, HiArrowRightCircle, HiPlayPause} from "react-icons/hi2";
import {IconBaseProps} from "react-icons";

type ControlBarProps = {
  player: Player;
}

export const ControlBar = (props: ControlBarProps) => {
  const player = props.player;
  return (
    <div className="flex gap-6 p-2 w-full items-center justify-center border-t bg-gray-50">
        <ControlButton onClick={() => player.seek(-15)} iconClass={HiArrowLeftCircle} />
        <ControlButton onClick={() => player.togglePause()} iconClass={HiPlayPause} />
        <ControlButton onClick={() => player.seek(15)} iconClass={HiArrowRightCircle} />
    </div>
  )
}

type ControlButtonProps = {
  children?: React.ReactNode;
  ariaLabel?: string;
  onClick: () => void;
  iconClass:  React.FunctionComponent<IconBaseProps>;
}

const ControlButton = (props: ControlButtonProps) => {
  const icon = React.createElement(props.iconClass, {color: "gray", className: "h-6 w-6"});
  return (
    <Button color="gray" className="border-gray-700" outline={true} pill={true} onClick={() => props.onClick()}>
      {icon}
    </Button>
  )
}

