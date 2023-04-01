/**
 * Represents the configuration object for the VideoTab component
 * @typedef {Object} VideoConfig
 * @property {RestAdaptor} host - The REST adaptor for fetching video collections
 * @property {VideoPlayer} videoPlayer - The video player service used for playing videos
 * @property {boolean} isActive - Whether the VideoTab is active or not
 */

import {useEffect, useState} from "react";
import {VideoEntry} from "../../domain/Messages";
import {VideoPlayer} from "../../services/Player";
import {VideoList} from "./VideoList";
import {RestAdaptor} from "../../adaptors/RestAdaptor";
import {log_error} from "../../services/Logger";

/**
 * Represents the VideoTab component
 * @function
 * @param {VideoConfig} props - Config object for the VideoTab component
 * @returns {JSX.Element} - The VideoTab component's UI
 */
const VideoTab = (props: VideoConfig) => {

  // State hooks for storing video collection data and the parent collection
  const [collections, setCollection] = useState(new VideoEntry());
  const [parentCollection, setParentCollection] = useState("");

  /**
   * Fetches video collection data and sets state hooks when component mounts
   * @function
   */
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

    // Fetch data and set interval to refetch data periodically when component is active
    if (props.isActive) {

      fetchData();

      const interval = setInterval(async () => {
        await fetchData()
      }, 2000);

      // Clear interval when component is unmounted
      return () => clearInterval(interval);
    }
  }, [props.videoPlayer.getCurrentCollection, props.videoPlayer, props.isActive])

  // Render VideoTab UI
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