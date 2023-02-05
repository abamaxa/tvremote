import {VideoEntry} from "../domain/VideoEntry";

type VideoEntryListArgs = {
  entry: VideoEntry;
  setCurrentCollection: (collection: string) => void;
  playVideo: (video: string) => void;
}

export const VideoEntryList = (message: VideoEntryListArgs) => {

  const getClasses = (isLast: boolean): string => {
    let classes = "w-full px-4 py-2 border-gray-200 dark:border-gray-600";
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
    const classes = getClasses(index == lastVideo) + " text-gray-500"
    return (<li key={name} className={classes} onClick={() => {message.playVideo(name); console.log(name)}}>{name}</li>);
  });

  return (
    <ul className="text-sm font-medium text-gray-900 border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
      {child_collections}
      {videos}
  </ul>);
}