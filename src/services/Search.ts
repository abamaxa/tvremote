import {SearchResult, SearchResultsMessage} from "../domain/Messages";
import {RestAdaptor} from "../adaptors/RestAdaptor";
import {log_error} from "./Logger";

export type setSearchResults = ((data: SearchResult[]) => void);

export interface Search {
  query: ((term: string, callback: setSearchResults) => void);
}

export class BaseSearch implements Search {

  private readonly host: RestAdaptor;
  private readonly url: string;

  constructor(host: RestAdaptor, url: string) {
    this.host = host;
    this.url = url;
  }

  query(term: string, setResultsCallback: setSearchResults) {
    this.host.get(this.url + term)
      .then((res) => res.json())
      .then((data: SearchResultsMessage) => {
        if (data.results !== null) {
          setResultsCallback(data.results);
        } else if (data.error !== null) {
          alert(data.error);
        }
      })
      .catch((err) => {
        log_error(err)
        alert(err);
      });
  }
}

export class PirateSearch extends BaseSearch {
  constructor(host: RestAdaptor) {
    super(host, "search/pirate?q=");
  }
}

export class YoutubeSearch extends BaseSearch {
  constructor(host: RestAdaptor) {
    super(host, "search/youtube?q=");
  }
}