import {ChangeEvent, Dispatch, FormEvent} from "react";
import {Label, Radio} from "flowbite-react";
import {SE_PIRATEBAY, SE_YOUTUBE} from "../../domain/Constants";
import {Action, ActionKind, State} from "./Reducer";

/**
 * Configuration options for the SearchBox component.
 * @param doSearch A function that takes a string query and a string engine code and triggers
 *                 a search with the given parameters.
 * @param state    The current search state object, with term and engine properties.
 * @param dispatch A function used to dispatch actions to the search state reducer.
 */
type SearchBoxConfig = {
  doSearch: ((query: string, engine: string) => void);
  state: State;
  dispatch: Dispatch<Action>;
}

/**
 * A reusable search box component that allows users to enter a search term and select a search engine.
 * Search will be triggered when the user submits the form.
 * @param props Configuration options for the SearchBox.
 * @returns The SearchBox component.
 */
export const SearchBox = (props: SearchBoxConfig) => {

  /**
   * Event handler for when the user selects a search engine.
   * @param e The change event triggered by the user's selection.
   */
  const onEngineSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    props.dispatch({type: ActionKind.ENGINE, payload: target.value});
  }

  /**
   * Event handler for when the user enters a search term.
   * @param e The change event triggered by the user's input.
   */
  const onSetTerm = (e: ChangeEvent<HTMLInputElement>) => {
    props.dispatch({type: ActionKind.TERM, payload: e.currentTarget.value});
  }

  /**
   * Event handler for when the user submits the search form.
   * Will trigger a search with the current search parameters unless the search term is empty.
   * @param e The form event triggered by the user's submission.
   */
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (props.state.term) {
      props.doSearch(props.state.term, props.state.engine);
    }
    e.preventDefault();
  }

  return (
    // Search input and submit button wrapped in a form element
    <form className="items-center" onSubmit={(e) => onSubmit(e)}>
      <div className="flex w-full">
        {/* Search input */}
        <label htmlFor="simple-search" className="sr-only">SearchTab</label>
        <div className="relative w-full">
          {/* Search icon */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor"
                 viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"></path>
            </svg>
          </div>
          {/* Search input field */}
          <input type="text"
                 id="search-term"
                 onChange={onSetTerm}
                 value={props.state.term}
                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                 placeholder="SearchTab" required />
        </div>
        {/* Search button */}
        <button type="submit"
                className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
               xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <span className="sr-only">SearchTab</span>
        </button>
      </div>

      {/* Search engine selection */}
      <div className="flex gap-4 pt-4 px-1">
        {/* PirateBay radio button */}
        <div className="flex items-center gap-2">
          <Radio
              id="piratebay"
              name="engine"
              value={SE_PIRATEBAY}
              defaultChecked={props.state.engine === SE_PIRATEBAY}
              onChange={onEngineSelect}
          />
          <Label htmlFor="piratebay">
            PirateBay
          </Label>
        </div>
        {/* YouTube radio button */}
        <div className="flex items-center gap-2">
          <Radio
              id="youtube"
              name="engine"
              value={SE_YOUTUBE}
              defaultChecked={props.state.engine === SE_YOUTUBE}
              onChange={onEngineSelect}
          />
          <Label htmlFor="youtube">
            YouTube
          </Label>
        </div>
      </div>
    </form>
  )
}