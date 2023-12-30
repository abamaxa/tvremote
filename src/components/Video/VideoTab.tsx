import { useEffect, useState} from "react";
import {CollectionDetails, MediaDetails} from "../../domain/Messages";
import {VideoPlayer} from "../../services/Player";
import {VideoList} from "./VideoList";
import {log_error} from "../../services/Logger";

/**
 * Represents the configuration object for the VideoTab component
 * @typedef {Object} VideoConfig
 * @property {VideoPlayer} videoPlayer - The video player service used for playing videos
 * @property {boolean} isActive - Whether the VideoTab is active or not
 */
export type VideoConfig = {
  videoPlayer: VideoPlayer;
  isActive: boolean;
  showVideoDetails: (name: string) => void;
}

export const REFRESH_INTERVAL: number = 200000;

/**
 * Represents the VideoTab component
 * @function
 * @param {VideoConfig} props - Config object for the VideoTab component
 * @returns {JSX.Element} - The VideoTab component's UI
 */
const VideoTab = (props: VideoConfig) => {

  // State hooks for storing video collection data and the parent collection
  const [collections, setCollection] = useState(new CollectionDetails());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mediaDetails: MediaDetails = await props.videoPlayer.fetchDetails();
        if (mediaDetails.Collection) {
          setCollection(mediaDetails.Collection);
        }
      } catch (error) {
        log_error(error, "fetchDetails");
      }
    };

    // Fetch data and set interval to re-fetch data periodically when component is active
    if (props.isActive) {

      fetchData();

      const interval = setInterval(async () => {
        await fetchData()
      }, REFRESH_INTERVAL);

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
          setVideoDetails={props.showVideoDetails}
          videoPlayer={props.videoPlayer}
        />
      </main>
    </div>
  )
}

export default VideoTab;