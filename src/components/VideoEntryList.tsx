import {VideoEntry} from "../domain/Messages";
import {LI_STYLE, UL_STYLE} from "../domain/Constants";

type VideoEntryListArgs = {
  entry: VideoEntry;
  setCurrentCollection: (collection: string) => void;
  playVideo: (video: string) => void;
}

export const VideoEntryList = (message: VideoEntryListArgs) => {

  const getClasses = (isLast: boolean): string => {
    let classes = LI_STYLE;
    if (!isLast) {
      classes += " border-b";
    }
    return classes;
  }

  const lastCollection = message.entry.child_collections.length - 1;
  const lastVideo = message.entry.videos.length - 1;

  const child_collections = message.entry.child_collections.map((name: string, index: number) => {
    const classes = getClasses(index == lastCollection && lastVideo < 0);

    return (<li key={name} className={classes} onClick={() => message.setCurrentCollection(name)}>{name}</li>);
  });

  const videos = message.entry.videos.map((name: string, index: number) => {
    const classes = getClasses(index == lastVideo) + " text-gray-600"
    return (<li key={name} className={classes} onClick={() => {message.playVideo(name); console.log(name)}}>{name}</li>);
  });

  return (
    <ul className={UL_STYLE}>
      {child_collections}
      {videos}
  </ul>);
}