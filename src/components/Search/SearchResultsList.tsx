import { SearchResult } from '../../domain/Messages';
import {LI_STYLE, UL_STYLE} from "../../domain/Constants";
import {State} from "./Reducer";

/**
 * Defines the configuration for SearchResultsList, the list of search results.
 * @typedef {Object} SearchResultsConfig
 * @property {SearchResult[]} results - The search results to be displayed.
 * @property {Function} onItemClick - The function to be called when an item in the search results is clicked.
 * @property {Object} state - The current state of the application.
 */
type SearchResultsConfig = {
  results: SearchResult[];

  onItemClick: ((item: SearchResult) => void);

  state: State;
}

/**
 * Defines the style for the search results list.
 * @type {string}
 */
const SEARCH_STYLE = UL_STYLE + " mt-4";

/**
 * Renders the list of search results.
 * @param {SearchResultsConfig} props - The configuration for the search results list.
 * @returns {JSX.Element} - The JSX element for the search results list.
 */
export const SearchResultsList = (props: SearchResultsConfig) => {

  /**
   * Maps each search result to a JSX element and adds click handlers.
   * @param {SearchResult} result - A search result to map to a JSX element.
   * @param {number} idx - The index of the search result in the list of results.
   * @param {SearchResult[]} arr - The list of search results.
   * @returns {JSX.Element} - The JSX element for the current search result.
   */
  const resultList = props.results.map((result: SearchResult, idx: number, arr:SearchResult[]) => {
    let classes = LI_STYLE;
    if (idx != arr.length - 1) {
      classes += " border-b";
    }
    return (
      <li
        className={classes}
        key={"search:" + idx}
        onClick={(_) => props.onItemClick(result)}>
        <p>{ result.title }</p>
        <p className="text-gray-600 text-xs">{ result.description }</p>
      </li>
    )
  })

  // If there are no search results to display, return a message indicating that there are no results.
  if (props.results.length == 0) {
    const forTerm = props.state.lastSearch ? `for ${props.state.lastSearch}` : "";
    return (<p className="px-1 py-2">No results {forTerm}</p>);
  } else {
    // Otherwise, render the list of search results.
    return (<ul className={SEARCH_STYLE}>{resultList}</ul>);
  }
}