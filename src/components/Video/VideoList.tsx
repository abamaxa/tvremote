import {VideoEntry} from "../../domain/Messages";
import {LI_STYLE, UL_STYLE} from "../../domain/Constants";
import {Dispatch, useState} from "react";
import {Player} from "../../services/Player";
import {VideoItem} from "./VideoItem";


type VideoEntryListArgs = {
  entry: VideoEntry;
  setCurrentCollection: (collection: string) => void;
  // playVideo: (video: string) => void;
  videoPlayer: Player;
}

type CollectionItemArgs = {
  isLast: boolean;
  name: string;
  setCurrentCollection: (collection: string) => void;
}

export const VideoList = (message: VideoEntryListArgs) => {
  
  const [dialog, setDialog] = useState<JSX.Element>((<></>));
  const lastCollection = message.entry.child_collections.length - 1;
  const lastVideo = message.entry.videos.length - 1;

  const back_button = (() => {
    const classes = getClasses(false);
    const collection = message.entry.parent_collection;
    if (message.entry.collection === "") {
      return (<></>);
    }
    return (<li key="0" className={classes} onClick={() => message.setCurrentCollection(collection)}>{'<-'} Back</li>)
  })();

  const child_collections = message.entry.child_collections.map((name: string, index: number) => {
    return (<CollectionItem
      key={name}
      isLast={index == lastCollection && lastVideo < 0}
      name={name}
      setCurrentCollection={message.setCurrentCollection}
    />);
  });

  const videos = message.entry.videos.map((name: string, index: number) => {
    return (
      <VideoItem
        key={name}
        isLast={index == lastVideo}
        name={name}
        videoPlayer={message.videoPlayer}
        setDialog={setDialog as Dispatch<any>}
      />);
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

const CollectionItem = (props: CollectionItemArgs) => {
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

const getClasses = (isLast: boolean): string => {
  let classes = LI_STYLE;
  if (!isLast) {
    classes += " border-b";
  }
  return classes;
}
