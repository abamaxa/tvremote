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

export const SearchTab = (props: SearchTabProps) => {

  // const [searchResults, setSearchResults] = useState([] as SearchResult[]);
  const searchResults = props.state.results;
  const setSearchResults = (results: SearchResult[]) => {
    props.dispatch({type: ActionKind.LAST_SEARCH, payload: props.state.term});
    props.dispatch({type: ActionKind.RESULTS, payload: results});
  }

  const onItemClick = (item: SearchResult) => {
    askQuestion(`Download ${item.title}?`, async () => {
      const downloadManager = new TaskManager(props.host);
      await downloadManager.add(item);
    });
  }

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