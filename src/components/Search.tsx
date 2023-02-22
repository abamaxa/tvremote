import {SearchBox} from "./SearchBox";
import {useState} from "react";
import {HostConfig, SearchResult} from "../domain/Messages";
import {SearchResultsList} from "./SearchResultsList";
import {PirateSearch} from "../services/Search";
import {DownloadManager} from "../services/Download";


export const Search = (props: HostConfig) => {

  const [searchResults, setSearchResults] = useState([] as SearchResult[]);

  const onItemClick = (item: SearchResult) =>{
    const downloadManager = new DownloadManager(props.host);
    downloadManager.add(item.link);
  }

  const doSearch = (query: string) =>{
    let searchEngine = new PirateSearch(props.host);
    searchEngine.query(query, setSearchResults);
  }

  return (
    <div className="p-0">
      <SearchBox doSearch={doSearch}/>
      <SearchResultsList results={searchResults} onItemClick={onItemClick}/>
    </div>
  )
}