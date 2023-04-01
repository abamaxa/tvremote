import {useEffect, useState} from "react";
import {VideoEntry} from "../../domain/Messages";
import {VideoPlayer} from "../../services/Player";
import {VideoList} from "./VideoList";
import {RestAdaptor} from "../../adaptors/RestAdaptor";
import {log_error} from "../../services/Logger";

type VideoConfig = {
  host: RestAdaptor;
  videoPlayer: VideoPlayer;
  isActive: boolean;
}

const VideoTab = (props: VideoConfig) => {

  const [collections, setCollection] = useState(new VideoEntry());
  const [parentCollection, setParentCollection] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: VideoEntry = await props.videoPlayer.fetchCollection();
        setCollection(data);
        setParentCollection(data.parent_collection);
      } catch (error) {
        log_error(error);
      }
    };

    if (props.isActive) {

      fetchData();

      const interval = setInterval(async () => {
        await fetchData()
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [props.videoPlayer.getCurrentCollection, props.videoPlayer, props.isActive])

  return (
    <div className="flex min-h-full flex-col items-center justify-center p-0">
      <main className="flex w-full flex-1 flex-col items-left justify-left">
        <VideoList
          entry={collections}
          setCurrentCollection={props.videoPlayer.setCurrentCollection}
          videoPlayer={props.videoPlayer}
        />
      </main>
    </div>
  )
}

export default VideoTab;
