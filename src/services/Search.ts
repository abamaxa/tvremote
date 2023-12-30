import {SearchResult, SearchResultsMessage} from "../domain/Messages";
import {RestAdaptor} from "../adaptors/RestAdaptor";
import {log_error} from "./Logger";
import {showInfoAlert} from "../components/Base/Alert";

/**
 * setSearchResults function type for setting search results
 * @typedef {Function} setSearchResults
 * @param {SearchResult[]} data - Array of SearchResult objects
 * @returns {void}
 */
export type setSearchResults = ((data: SearchResult[]) => void);

/**
 * Search interface that defines a query method
 * @interface Search
 */
export interface Search {
  /**
   * Query method for searching
   * @param {string} term - Search term
   * @param {setSearchResults} callback - Callback function for setting search results
   * @returns {void}
   */
  query: ((term: string, callback: setSearchResults) => void);
}

/**
 * BaseSearch class that implements the Search interface
 * @class BaseSearch
 * @implements {Search}
 */
export class BaseSearch implements Search {
  
  /**
   * RestAdaptor for making REST API calls
   * @type {RestAdaptor}
   * @private
   */
  private readonly host: RestAdaptor;

  /**
   * API url for search
   * @type {string}
   * @private
   */
  private readonly url: string;

  /**
   * Constructor for BaseSearch class
   * @param {RestAdaptor} host - The RestAdaptor for making REST API calls
   * @param {string} url - The API url for search
   */
  constructor(host: RestAdaptor, url: string) {
    this.host = host;
    this.url = url;
  }

  /**
   * Query method for searching
   * @param {string} term - Search term
   * @param {setSearchResults} setResultsCallback - Callback function for setting search results
   * @returns {void}
   */
  async query(term: string, setResultsCallback: setSearchResults) {
    try {
      const data: SearchResultsMessage = await this.host.get(this.url + term);
      if (data.results !== null) {
        setResultsCallback(data.results);
      } else if (data.error !== null) {
        showInfoAlert(data.error);
      }
    } catch(error) {
      log_error(error, `query: ${term}`);
    }
  }
}

/**
 * PirateSearch allows searching on Pirate Bay
 */
export class PirateSearch extends BaseSearch {
  constructor(host: RestAdaptor) {
    super(host, "search/pirate?q=");
  }
}

/**
 * YoutubeSearch class allows searching on YouTube
 */
export class YoutubeSearch extends BaseSearch {
  constructor(host: RestAdaptor) {
    super(host, "search/youtube?q=");
  }
}