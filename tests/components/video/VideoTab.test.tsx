import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VideoTab, {REFRESH_INTERVAL, VideoConfig} from "../../../src/components/Video/VideoTab";
import {CollectionDetails} from "../../../src/domain/Messages";
import {RestAdaptor} from "../../../src/adaptors/RestAdaptor";

const mockRestAdaptor: RestAdaptor = {
  get: jest.fn(),
  delete: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  getHost: jest.fn(),
};

describe("VideoTab", () => {
  const testChildCollection = "test collection1";
  const testVideo = "test video 1";
  const mockVideoEntry = new CollectionDetails();
  mockVideoEntry.child_collections = [testChildCollection];
  mockVideoEntry.videos = [testVideo];

  let props: VideoConfig;

  beforeEach(() => {
    props = {
      //host: mockRestAdaptor,
      showVideoDetails: jest.fn(),
      videoPlayer: {
        fetchDetails: jest.fn(() => Promise.resolve({Collection: mockVideoEntry})),
        getCurrentCollection: jest.fn(),
        setCurrentCollection: jest.fn(),
      },
      isActive: true,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders VideoList component when isActive is true", async () => {
    await waitFor(() => render(<VideoTab {...props} />));
    expect(props.videoPlayer.fetchDetails).toHaveBeenCalled();
    await screen.findByText(testChildCollection);
    expect(props.videoPlayer.getCurrentCollection).not.toHaveBeenCalled();
    expect(props.videoPlayer.setCurrentCollection).not.toHaveBeenCalled();
    expect(screen.getByText(testChildCollection)).toBeInTheDocument();

    const videoEntry = screen.getAllByRole("listitem")[0];
    await userEvent.click(videoEntry);
    expect(props.videoPlayer.setCurrentCollection).toHaveBeenCalled();
  });

  it("does not render VideoList component when isActive is false", async () => {
    props.isActive = false;
    render(<VideoTab {...props} />);
    expect(props.videoPlayer.fetchDetails).not.toHaveBeenCalled();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    expect(screen.queryByText("Video List")).not.toBeInTheDocument();
  });

  it("calls fetchData function every 2 seconds when isActive is true", async () => {
    jest.useFakeTimers();
    await waitFor(() => render(<VideoTab {...props} />));

    expect(props.videoPlayer.fetchDetails).toHaveBeenCalled();

    jest.advanceTimersByTime(REFRESH_INTERVAL);
    expect(props.videoPlayer.fetchDetails).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(REFRESH_INTERVAL);
    expect(props.videoPlayer.fetchDetails).toHaveBeenCalledTimes(3);

    jest.clearAllTimers();
  });

  it("calls setCurrentCollection function when VideoList component is clicked", async () => {
    await waitFor(() => render(<VideoTab {...props} />));

    expect(props.videoPlayer.fetchDetails).toHaveBeenCalled();
    await screen.findByText(testChildCollection);

    const videoEntry = screen.getAllByRole("listitem")[0];
    videoEntry.click()
    expect(props.videoPlayer.setCurrentCollection).toHaveBeenCalled();
  });

  it("logs error when fetchData function throws an error", async () => {
    props.videoPlayer.fetchDetails.mockRejectedValueOnce(new Error());
    const consoleSpy = jest.spyOn(console, "error").mockImplementationOnce(() => {});
    await waitFor(() => render(<VideoTab {...props} />));
    expect(props.videoPlayer.fetchDetails).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

});