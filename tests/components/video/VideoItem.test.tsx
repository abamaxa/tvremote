import {render, fireEvent, waitFor} from "@testing-library/react";
import {Player} from "../../../src/services/Player";
import {VideoItem} from "../../../src/components/Video/VideoItem";
import PopupMenu from "../../../src/components/Base/PopupMenu";


describe("VideoItem", () => {
  let mockVideoPlayer: Player;
  let mockSetDialog: jest.Mock;
  let savedPopup: React.ReactElement;

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
    const name = "example.mp4";
    const isLast = false;
    const {getByText} = render(
      <VideoItem
        name={name}
        isLast={isLast}
        videoPlayer={mockVideoPlayer}
        setVideoDetails={mockSetDialog}
      />
    );

    expect(getByText(name)).toBeInTheDocument();
  });

  test("opens popup menu on click", async () => {
    const name = "example.mp4";
    const isLast = false;
    const {getByText} = await waitFor(() => render(
      <VideoItem
        name={name}
        isLast={isLast}
        videoPlayer={mockVideoPlayer}
        setVideoDetails={mockSetDialog}
      />
    ));

    fireEvent.click(getByText(name));

    expect(mockSetDialog).toHaveBeenCalled();
  });

});
