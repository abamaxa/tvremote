import {render, fireEvent, waitFor, act} from "@testing-library/react";
import {Player} from "../../../src/services/Player";
import {VideoItem} from "../../../src/components/Video/VideoItem";
import PopupMenu from "../../../src/components/Base/PopupMenu";
import { VideoDetails } from "@/domain/Messages";


describe("VideoItem", () => {
  let mockVideoPlayer: Player;
  let mockSetDialog: jest.Mock;
  let savedPopup: React.ReactElement;
  const video: VideoDetails = {
    video: "example.mp4",
    collection: "",
    description: "",
    series: {
      seriesTitle: "The Series",
      episodeTitle: "The eposide",
      season: "1",
      episode: "2"
    },
    thumbnail: "",
    metadata: {
      duration: 0,
      width: 0,
      height: 0,
      audioTracks: 0
    }
  };

  beforeEach(() => {
    mockVideoPlayer = {
      playVideo: jest.fn(),
      deleteVideo: jest.fn(),
    } as unknown as Player;
    mockSetDialog = jest.fn((item) => savedPopup = item);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("displays the name of the video", () => {
    const isLast = false;
    const {getByText} = render(
      <VideoItem
        video={video}
        isLast={isLast}
        videoPlayer={mockVideoPlayer}
        setVideoDetails={mockSetDialog}
      />
    );

    expect(getByText(video.video)).toBeInTheDocument();
  });

  test("opens popup menu on click", async () => {
    const isLast = false;
    const {getByText} = await waitFor(() => render(
      <VideoItem
        video={video}
        isLast={isLast}
        videoPlayer={mockVideoPlayer}
        setVideoDetails={mockSetDialog}
      />
    ));

    act(() => {
      fireEvent.click(getByText(video.video));
    })
    
    expect(mockSetDialog).toHaveBeenCalled();
  });
});
