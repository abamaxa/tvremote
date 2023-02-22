import {useEffect, useState} from "react";
import {HostConfig, VideoEntry} from "../domain/Messages";
import {VideoPlayer} from "../services/Player";
import {VideoEntryList} from "./VideoEntryList";
import {ControlBar} from "./ControlBar";


const Videos = (props: HostConfig) => {

  const [collections, setCollection] = useState(new VideoEntry());
  const [currentCollection, setCurrentCollection] = useState("");
  const [parentCollection, setParentCollection] = useState("");

  const videoPlayer = new VideoPlayer(currentCollection, props.host, "");

  useEffect(() => {
    videoPlayer.fetchCollection()
      .then((res) => res.json())
      .then((data) => {
        setCollection(data)
        setParentCollection(data.parent_collection)
      })
      .catch((err) => {
        console.log(err)
        alert(err);
      })
  }, [currentCollection])

  return (
    <div className="flex min-h-full flex-col items-center justify-center p-0">
      <main className="flex w-full flex-1 flex-col items-left justify-left">
        <button type="button" onClick={() => setCurrentCollection(parentCollection)}>
          Back
        </button>
        <VideoEntryList
          entry={collections}
          setCurrentCollection={setCurrentCollection}
          playVideo={videoPlayer.playVideo}
        />
      </main>
      <ControlBar player={videoPlayer} />
    </div>
  )
}

/*

 */

export default Videos;
