/**
 * The SearchResult interface represents the shape of the data returned by a search query.
 *
 * @interface SearchResult
 * @property {string} title - The title of the search result.
 * @property {string} url - The URL of the search result.
 */

import { SearchResult } from "../../domain/Messages";

/**
 * The ActionKind enum represents the types of actions that can be dispatched using the reducer.
 *
 * @enum {string}
 */
export enum ActionKind {
  TERM = "TERM",
  RESULTS = "RESULTS",
  ENGINE = "ENGINE",
  LAST_SEARCH = "LAST_SEARCH",
}

/**
 * The Action interface represents the shape of actions that can be dispatched using the reducer.
 *
 * @interface Action
 * @property {ActionKind} type - The type of action being dispatched.
 * @property {string|SearchResult[]} payload - The data associated with the action.
 */
export interface Action {
  type: ActionKind;
  payload: string | SearchResult[];
}

/**
 * The State interface represents the shape of the state managed by the reducer.
 *
 * @interface State
 * @property {string} term - The search term being used.
 * @property {string} engine - The search engine being used.
 * @property {SearchResult[]} results - The results of the most recent search.
 * @property {string} lastSearch - The timestamp of the most recent search.
 */
export interface State {
  term: string;
  engine: string,
  results: SearchResult[],
  lastSearch: string
}

/**
 * The reducer function updates the state based on the action dispatched.
 *
 * @function reducer
 * @param {State} state - The current state of the application.
 * @param {Action} action - The action being dispatched.
 * @returns {State} The updated state.
 */
export const reducer = (state: State, action: Action) => {
  const { type, payload } = action;
  switch (type) {
    case ActionKind.TERM:
      return {
        ...state,
        term: payload,
      };

    case ActionKind.ENGINE:
      return {
        ...state,
        engine: payload,
      };

    case ActionKind.RESULTS:
      return {
        ...state,
        results: payload,
      };

    case ActionKind.LAST_SEARCH:
      return {
        ...state,
        lastSearch: payload,
      };

    default:
      return state;
  }
}