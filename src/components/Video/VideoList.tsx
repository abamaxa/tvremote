import { VideoEntry } from "../../domain/Messages";
import { LI_STYLE, UL_STYLE } from "../../domain/Constants";
import { Dispatch, useState } from "react";
import { Player } from "../../services/Player";
import { VideoItem } from "./VideoItem";

type VideoEntryListArgs = {
  entry: VideoEntry;
  setCurrentCollection: (collection: string) => void;
  videoPlayer: Player;
}

type CollectionItemArgs = {
  isLast: boolean;
  name: string;
  setCurrentCollection: (collection: string) => void;
}

/**
 * VideoList component, used to display a list of videos and child collections
 * 
 * @param {VideoEntryListArgs} message - object containing the current message entry, collection set function and player
 * 
 * @returns {JSX.Element} - returns a JSX element containing the video and collection items to be displayed
 */
export const VideoList = (message: VideoEntryListArgs): JSX.Element => {
  
  const [dialog, setDialog] = useState<JSX.Element>((<></>));
  const lastCollection = message.entry.child_collections.length - 1;
  const lastVideo = message.entry.videos.length - 1;

  const back_button = (() => {
    const classes = getClasses(false);
    const collection = message.entry.parent_collection;
    if (message.entry.collection === "") {
      return (<></>);
    }
    return (
      <li key="0" className={classes} onClick={() => message.setCurrentCollection(collection)}>
        {'<-' } Back
      </li>
    )
  })();

  const child_collections = message.entry.child_collections.map((name: string, index: number): JSX.Element => {
    return (
      <CollectionItem
        key={name}
        isLast={index === lastCollection && lastVideo < 0}
        name={name}
        setCurrentCollection={message.setCurrentCollection}
      />
    );
  });

  const videos = message.entry.videos.map((name: string, index: number): JSX.Element => {
    return (
      <VideoItem
        key={name}
        isLast={index === lastVideo}
        name={name}
        videoPlayer={message.videoPlayer}
        setDialog={setDialog as Dispatch<any>}
      />
    );
  });

  return (
    <>
      {dialog}
      <ul className={UL_STYLE}>
        {back_button}
        {child_collections}
        {videos}
      </ul>      
    </>
  );
}

/**
 * CollectionItem component, used to display each collection item
 * 
 * @param {CollectionItemArgs} props - object containing the attributes of the collection item to be displayed
 * 
 * @returns {JSX.Element} - returns a JSX element containing the collection item to be displayed
 */
const CollectionItem = (props: CollectionItemArgs): JSX.Element => {
  const classes = getClasses(props.isLast);
  return (
    <li
      className={classes}
      onClick={() => props.setCurrentCollection(props.name)}
    >
      {props.name}
    </li>
  );
}

/**
 * Helper function to get the classes to be applied to each item in the list
 * 
 * @param {boolean} isLast - boolean indicating whether an item is the last in the list
 * 
 * @returns {string} - returns a string of classes for the item
 */
const getClasses = (isLast: boolean): string => {
  let classes = LI_STYLE;
  if (!isLast) {
    classes += " border-b";
  }
  return classes;
}