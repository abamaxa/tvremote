import {secondsToTimeString} from "../services/helpers";
import {SeriesDetails, VideoDetails, VideoMetadata} from "./Messages";

export class VideoDetailsImpl implements VideoDetails {
  public video: string;
  public collection: string;
  public description: string;
  public series: SeriesDetails;
  public thumbnail: string;
  public metadata: VideoMetadata;
  constructor(details: VideoDetails) {
    this.video = details.video;
    this.collection = details.collection;
    this.description = details.description;
    this.series = details.series;
    this.thumbnail = details.thumbnail;
    this.metadata = details.metadata;
  }

  getDuration = (): string => {
    return secondsToTimeString(this.metadata.duration);
  }

  getSize = (): string => {
    return `${this.metadata.width}x${this.metadata.height}`;
  }
}