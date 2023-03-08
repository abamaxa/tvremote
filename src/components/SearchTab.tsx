import {SearchBox} from "./SearchBox";
import {useState} from "react";
import {HostConfig, SearchResult} from "../domain/Messages";
import {SearchResultsList} from "./SearchResultsList";
import {PirateSearch, Search, YoutubeSearch} from "../services/Search";
import {DownloadManager} from "../services/Download";
import {log_error} from "../services/Logger";
import {showQuestionAlert} from "./Alert";

export const SearchTab = (props: HostConfig) => {

  const [searchResults, setSearchResults] = useState([] as SearchResult[]);

  const onItemClick = (item: SearchResult) => {
    showQuestionAlert(`Download ${item.title}?`, () => {
      const downloadManager = new DownloadManager(props.host);
      downloadManager.add(item);
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
      <SearchBox doSearch={doSearch}/>
      <SearchResultsList results={searchResults} onItemClick={onItemClick}/>
    </div>
  )
}