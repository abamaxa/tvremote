import {SearchResult} from "../../domain/Messages";

export enum ActionKind {
  TERM = "TERM",
  RESULTS = "RESULTS",
  ENGINE = "ENGINE",
  LAST_SEARCH = "LAST_SEARCH",
}

// An interface for our actions
export interface Action {
  type: ActionKind;
  payload: string | SearchResult[];
}

export interface State {
  term: string;
  engine: string,
  results: SearchResult[],
  lastSearch: string
}

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
