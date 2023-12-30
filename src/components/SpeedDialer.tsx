import {RemoteMessage} from "../domain/Messages";
import {HiCloudDownload, HiSearch, HiVideoCamera} from "react-icons/hi";
import React from "react";


/**
 * Defines properties of SpeedDialer component, including closeMenu(), an optional scrollTop number,
 * and the element to which the popup menu is attached
 */
type SpeedDialerProps = {
  lastMessage?: RemoteMessage;
  showTasks: (() => void);
  showSearch: (() => void);
  showCurrentVideo: (() => void);
};


/**
 * Returns a floating button React component, like s speed dial button, with proper positioning, styling, and behavior.
 *
 * @param {SpeedDialerProps} props - Properties of SpeedDialer component, including closeMenu(), optional scrollTop,
 * and the element to which the popup menu is attached
 */
export const SpeedDialer = (props: SpeedDialerProps) => {

  /**
   * Renders the popup menu with proper HTML structure and properties
   */
  const containerClasses = "z-20 p-1 fixed flex flex-col-reverse gap-4 right-2 bottom-2 group";
  const buttonClasses = "flex rounded-full w-14 h-14 justify-center items-center border-2 border-gray-300 bg-primary-700 hover:bg-primary-900 shadow-lg";
  const iconClasses = "h-6 w-6";
  const videoButtonClasses = buttonClasses + (typeof props.lastMessage?.State === "undefined" ? " invisible" : "");
  const videoIcon = typeof props.lastMessage?.State === "undefined" ? (<></>) : (<HiVideoCamera color="white" className={iconClasses} />);

  return (
    <div className={containerClasses}>
      <div className={buttonClasses} onClick={() => props.showTasks()}>
        <HiCloudDownload color="white" className={iconClasses} />
      </div>
      <div className={buttonClasses} onClick={() => props.showSearch()}>
        <HiSearch color="white"  className={iconClasses} />
      </div>
      <div className={videoButtonClasses} onClick={() => props.showCurrentVideo()}>
        { videoIcon }
      </div>
    </div>
  );
}
