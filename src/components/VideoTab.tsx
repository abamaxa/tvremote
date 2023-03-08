import {useEffect, useState} from "react";
import {VideoEntry} from "../domain/Messages";
import {VideoPlayer} from "../services/Player";
import {VideoEntryList} from "./VideoEntryList";
import {RestAdaptor} from "../adaptors/RestAdaptor";
import {log_error} from "../services/Logger";

type VideoConfig = {
  host: RestAdaptor;
  videoPlayer: VideoPlayer;
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

    fetchData();

  }, [props.videoPlayer.getCurrentCollection, props.videoPlayer])

  return (
    <div className="flex min-h-full flex-col items-center justify-center p-0">
      <main className="flex w-full flex-1 flex-col items-left justify-left">
        <VideoEntryList
          entry={collections}
          setCurrentCollection={props.videoPlayer.setCurrentCollection}
          playVideo={props.videoPlayer.playVideo}
        />
      </main>
    </div>
  )
}

export default VideoTab;
