import { render, fireEvent } from "@testing-library/react";
import { SearchResultsList } from "../../../src/components/Search/SearchResultsList";
import { SearchResult } from "../../../src/domain/Messages";
import { State } from "../../../src/components/Search/Reducer";


describe("SearchResultsList", () => {
  const mockResults: SearchResult[] = [
    new SearchResult("Result 1", "Description 1", "http://link1.com", "youtube"),
    new SearchResult("Result 2", "Description 2", "http://link2.com", "piratebay"),
    new SearchResult("Result 3", "Description 3", "http://link3.com", "youtube"),
  ];

  const mockState: State = {
    term: "test",
    engine: "youtube",
    results: mockResults,
    lastSearch: "test",
  };

  it("renders search results list correctly", () => {
    const onItemClick = jest.fn();
    const { getByText } = render(<SearchResultsList results={mockResults} onItemClick={onItemClick} state={mockState} />);

    expect(getByText("Result 1")).toBeInTheDocument();
    expect(getByText("Description 1")).toBeInTheDocument();
    expect(getByText("Result 2")).toBeInTheDocument();
    expect(getByText("Description 2")).toBeInTheDocument();
    expect(getByText("Result 3")).toBeInTheDocument();
    expect(getByText("Description 3")).toBeInTheDocument();
  });

  it("calls onItemClick when a search result is clicked", () => {
    const onItemClick = jest.fn();
    const { getByText } = render(<SearchResultsList results={mockResults} onItemClick={onItemClick} state={mockState} />);

    fireEvent.click(getByText("Result 2"));
    expect(onItemClick).toHaveBeenCalledWith(mockResults[1]);
  });

  it("displays 'No results' message when results are empty", () => {
    const onItemClick = jest.fn();
    const { getByText } = render(<SearchResultsList results={[]} onItemClick={onItemClick} state={{...mockState, lastSearch: ""}} />);

    expect(getByText("No results")).toBeInTheDocument();
  });

  it("displays 'No results for term' message when results are empty and lastSearch is set", () => {
    const onItemClick = jest.fn();
    const { getByText } = render(<SearchResultsList results={[]} onItemClick={onItemClick} state={mockState} />);

    expect(getByText("No results for test")).toBeInTheDocument();
  });
});
