import {SearchEngine, SearchResult} from "../../../src/domain/Messages";
import {Action, ActionKind, State, reducer} from "../../../src/components/Search/Reducer";

describe("SearchResult class", () => {
  test("creating a SearchResult instance sets properties correctly", () => {
    const title = "Title";
    const description = "Description";
    const link = "https://example.com";
    const engine = SearchEngine.YouTube;

    const result = new SearchResult(title, description, link, engine);

    expect(result.title).toEqual(title);
    expect(result.description).toEqual(description);
    expect(result.link).toEqual(link);
    expect(result.engine).toEqual(engine);
  });
});

describe("reducer function", () => {
  test("reducer returns default state when given invalid action", () => {
    const initialState: State = {
      term: "",
      engine: SearchEngine.YouTube,
      results: [],
      lastSearch: "",
    };

    const action: Action = {
      type: "INVALID_ACTION_TYPE",
      payload: "",
    };

    const result = reducer(initialState, action);

    expect(result).toEqual(initialState);
  });

  test("reducer sets search term correctly", () => {
    const initialState: State = {
      term: "",
      engine: SearchEngine.YouTube,
      results: [],
      lastSearch: "",
    };

    const searchTerm = "Test search term";

    const action: Action = {
      type: ActionKind.TERM,
      payload: searchTerm,
    };

    const result = reducer(initialState, action);

    expect(result.term).toEqual(searchTerm);
    expect(result.engine).toEqual(initialState.engine);
    expect(result.results).toEqual(initialState.results);
    expect(result.lastSearch).toEqual(initialState.lastSearch);
  });

  test("reducer sets search engine correctly", () => {
    const initialState: State = {
      term: "",
      engine: SearchEngine.YouTube,
      results: [],
      lastSearch: "",
    };

    const engine = SearchEngine.PirateBay;

    const action: Action = {
      type: ActionKind.ENGINE,
      payload: engine,
    };

    const result = reducer(initialState, action);

    expect(result.term).toEqual(initialState.term);
    expect(result.engine).toEqual(engine);
    expect(result.results).toEqual(initialState.results);
    expect(result.lastSearch).toEqual(initialState.lastSearch);
  });

  test("reducer sets search results correctly", () => {
    const initialState: State = {
      term: "",
      engine: SearchEngine.YouTube,
      results: [],
      lastSearch: "",
    };

    const results = [
      new SearchResult("Title 1", "Description 1", "https://example.com/1", SearchEngine.YouTube),
      new SearchResult("Title 2", "Description 2", "https://example.com/2", SearchEngine.YouTube),
    ];

    const action: Action = {
      type: ActionKind.RESULTS,
      payload: results,
    };

    const result = reducer(initialState, action);

    expect(result.term).toEqual(initialState.term);
    expect(result.engine).toEqual(initialState.engine);
    expect(result.results).toEqual(results);
    expect(result.lastSearch).toEqual(initialState.lastSearch);
  });

  test("reducer sets last search correctly", () => {
    const initialState: State = {
      term: "",
      engine: SearchEngine.YouTube,
      results: [],
      lastSearch: "",
    };

    const searchTerm = "Test search term";

    const action: Action = {
      type: ActionKind.LAST_SEARCH,
      payload: searchTerm,
    };

    const result = reducer(initialState, action);

    expect(result.term).toEqual(initialState.term);
    expect(result.engine).toEqual(initialState.engine);
    expect(result.results).toEqual(initialState.results);
    expect(result.lastSearch).toEqual(searchTerm);
  });
});