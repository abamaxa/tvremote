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
        setDialog={mockSetDialog}
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
        setDialog={mockSetDialog}
      />
    ));

    fireEvent.click(getByText(name));

    expect(mockSetDialog).toHaveBeenCalled();
  });

  test("calls playVideo when Play is clicked", async () => {
    const name = "example.mp4";
    const isLast = false;
    const videoList = (
      <VideoItem
        name={name}
        isLast={isLast}
        videoPlayer={mockVideoPlayer}
        setDialog={mockSetDialog}
      />
    );

    const {getByText} = await waitFor(() => render(videoList));

    fireEvent.click(getByText(name));

    const {findByText} = await waitFor(() => render(savedPopup));

    const playButton = await findByText("Play");

    fireEvent.click(playButton);

    expect(mockVideoPlayer.playVideo).toHaveBeenCalledWith(name);
  });

  test("calls deleteVideo when Delete is clicked", async () => {
    const name = "example.mp4";
    const isLast = false;
    const {getByText} = await waitFor(() => render(
      <VideoItem
        name={name}
        isLast={isLast}
        videoPlayer={mockVideoPlayer}
        setDialog={mockSetDialog}
      />
    ));

    fireEvent.click(getByText(name));

    const {findByText} = await waitFor(() => render(savedPopup));

    const deleteButton = await findByText("Delete");

    fireEvent.click(deleteButton);

    expect(mockVideoPlayer.deleteVideo).toHaveBeenCalledWith(name);
  });

  test("opens Rename modal when Rename is clicked", async () => {
    const name = "example2.mp4";
    const isLast = false;
    const {getByText} = await waitFor(() => render(
      <VideoItem
        name={name}
        isLast={isLast}
        videoPlayer={mockVideoPlayer}
        setDialog={mockSetDialog}
      />
    ));

    fireEvent.click(getByText(name));

    const {findByText} = await waitFor(() => render(savedPopup));

    const renameButton = await findByText("Rename");

    fireEvent.click(renameButton);

    expect(mockSetDialog).toHaveBeenCalled();
  });

  test("opens Convert modal when Convert is clicked", async () => {
    const name = "example.mp4";
    const isLast = false;
    const {getByText} = await waitFor(() => render(
      <VideoItem
        name={name}
        isLast={isLast}
        videoPlayer={mockVideoPlayer}
        setDialog={mockSetDialog}
      />
    ));

    fireEvent.click(getByText(name));

    const {findByText} = await waitFor(() => render(savedPopup));

    const convertButton = await findByText("Convert...");

    fireEvent.click(convertButton);

    expect(mockSetDialog).toHaveBeenCalled();
  });
});
