import {ResultsMessage, SearchEngine, SearchResult} from "../../src/domain/Messages";
import {RestAdaptor} from "../../src/adaptors/RestAdaptor";
import {BaseSearch, PirateSearch, Search, setSearchResults, YoutubeSearch} from "../../src/services/Search";

const mockResults: SearchResult[] = [
  new SearchResult("Title 1", "Description 1", "http://example.com/1", SearchEngine.YouTube),
  new SearchResult("Title 2", "Description 2", "http://example.com/2", SearchEngine.PirateBay),
  new SearchResult("Title 3", "Description 3", "http://example.com/3", SearchEngine.YouTube),
];

/*
Note that these tests assume that the showErrorAlert, showWarningAlert, and askQuestion
functions are mocked or stubbed out in some way, as they are not defined in the example code.
 */

const mockResultsMessage: ResultsMessage<SearchResult> = {
  results: mockResults,
  error: null,
};

const mockHost: RestAdaptor = {
  get: jest.fn().mockResolvedValue(mockResultsMessage),
  delete: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  getHost: jest.fn(),
};

describe("BaseSearch", () => {
  let search: Search;

  beforeEach(() => {
    search = new BaseSearch(mockHost, "search/test?q=");
  });

  it("should fetch search results from the server", async () => {
    const setResultsCallback: setSearchResults = jest.fn();
    await search.query("test", setResultsCallback);
    expect(mockHost.get).toHaveBeenCalledWith("search/test?q=test");
    expect(setResultsCallback).toHaveBeenCalledWith(mockResults);
  });

  it("should handle server errors", async () => {
    const error = "Something went wrong!";
    const errorResult: ResultsMessage<SearchResult> = {
      results: null,
      error: error,
    };
    mockHost.get.mockResolvedValueOnce(errorResult);
    const setResultsCallback: setSearchResults = jest.fn();
    await search.query("test", setResultsCallback);
    expect(mockHost.get).toHaveBeenCalledWith("search/test?q=test");
    expect(setResultsCallback).not.toHaveBeenCalled();
    expect(mockHost.get).toHaveBeenCalledTimes(2);
  });

  it("should handle network errors", async () => {
    const error = "Network error!";
    mockHost.get.mockRejectedValueOnce(error);
    const setResultsCallback: setSearchResults = jest.fn();
    await search.query("test", setResultsCallback);
    expect(mockHost.get).toHaveBeenCalledWith("search/test?q=test");
    expect(setResultsCallback).not.toHaveBeenCalled();
  });
});

describe("PirateSearch", () => {
  let search: Search;

  beforeEach(() => {
    search = new PirateSearch(mockHost);
  });

  it("should query PirateBay search results", async () => {
    const setResultsCallback: setSearchResults = jest.fn();
    await search.query("test", setResultsCallback);
    expect(mockHost.get).toHaveBeenCalledWith("search/pirate?q=test");
    expect(setResultsCallback).toHaveBeenCalledWith(mockResults);
  });
});

describe("YoutubeSearch", () => {
  let search: Search;

  beforeEach(() => {
    search = new YoutubeSearch(mockHost);
  });

  it("should query YouTube search results", async () => {
    const setResultsCallback: setSearchResults = jest.fn();
    await search.query("test", setResultsCallback);
    expect(mockHost.get).toHaveBeenCalledWith("search/youtube?q=test");
    expect(setResultsCallback).toHaveBeenCalledWith(mockResults);
  });
});
