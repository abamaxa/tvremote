import {SearchBox} from "./SearchBox";
import {Dispatch} from "react";
import {SearchResult} from "../../domain/Messages";
import {SearchResultsList} from "./SearchResultsList";
import {PirateSearch, Search, YoutubeSearch} from "../../services/Search";
import {TaskManager} from "../../services/Task";
import {log_error} from "../../services/Logger";
import {askQuestion} from "../Base/Alert";
import {RestAdaptor} from "../../adaptors/RestAdaptor";
import {Action, ActionKind, State} from "./Reducer";

type SearchTabProps = {
  host: RestAdaptor,
  state: State,
  dispatch: Dispatch<Action>,
}

/**
 * Describes the properties passed to the SearchTab component
 * @typedef {Object} SearchTabProps
 * @property {RestAdaptor} host - The REST adaptor used to communicate with the server
 * @property {State} state - The current state of the component controlling the search behavior
 * @property {Dispatch<Action>} dispatch - The dispatch function used to apply changes to the state
 */

/**
 * The SearchTab component renders a search box and a list of results
 * @function SearchTab
 * @param {SearchTabProps} props - The props passed to the component
 * @returns {JSX.Element} - The SearchTab component
 */
export const SearchTab = (props: SearchTabProps) => {

  // const [searchResults, setSearchResults] = useState([] as SearchResult[]);
  const searchResults = props.state.results;
  
  /**
   * This function sets the result state using the new results
   * @function setSearchResults
   * @param {SearchResult[]} results - The results of the search
   * @returns {void}
   */
  const setSearchResults = (results: SearchResult[]) => {
    props.dispatch({type: ActionKind.LAST_SEARCH, payload: props.state.term});
    props.dispatch({type: ActionKind.RESULTS, payload: results});
  }

  /**
   * This function is called when a search result is clicked
   * @function onItemClick
   * @param {SearchResult} item - The item that was clicked
   * @returns {void}
   */
  const onItemClick = (item: SearchResult) => {
    askQuestion(`Download ${item.title}?`, async () => {
      const downloadManager = new TaskManager(props.host);
      await downloadManager.add(item);
    });
  }

  /**
   * This function executes the search using a specified search engine
   * @function doSearch
   * @param {string} query - The query to search for
   * @param {string} engine - The search engine to use
   * @returns {void}
   */
  const doSearch = (query: string, engine: string) => {
    let searchEngine: Search;
    switch (engine) {
      case "piratebay":
        searchEngine = new PirateSearch(props.host);
        break;

      case "youtube":
        searchEngine = new YoutubeSearch(props.host);
        break;

      default:
        log_error(`unknown search engine ${engine}`);
        return;
    }

    searchEngine.query(query, setSearchResults);
  }

  return (
    <div className="p-0">
      <SearchBox doSearch={doSearch} state={props.state} dispatch={props.dispatch}/>
      <SearchResultsList state={props.state} results={searchResults} onItemClick={onItemClick}/>
    </div>
  )
}