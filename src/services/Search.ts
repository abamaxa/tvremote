import {SearchResult, SearchResultsMessage} from "../domain/Messages";
import {RestAdaptor} from "../adaptors/RestAdaptor";
import {log_error} from "./Logger";
import {showInfoAlert} from "../components/Base/Alert";

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

  async query(term: string, setResultsCallback: setSearchResults) {
    try {
      const data: SearchResultsMessage = await this.host.get(this.url + term);
      if (data.results !== null) {
        setResultsCallback(data.results);
      } else if (data.error !== null) {
        showInfoAlert(data.error);
      }
    } catch(error) {
      log_error(error);
    }
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