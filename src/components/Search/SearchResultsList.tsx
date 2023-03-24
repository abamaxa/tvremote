import { SearchResult } from '../../domain/Messages';
import {LI_STYLE, UL_STYLE} from "../../domain/Constants";
import {State} from "./Reducer";

type SearchResultsConfig = {
  results: SearchResult[];

  onItemClick: ((item: SearchResult) => void);

  state: State;
}

const SEARCH_STYLE = UL_STYLE + " mt-4";

export const SearchResultsList = (props: SearchResultsConfig) => {

  const resultList = props.results.map((result: SearchResult, idx: number, arr:SearchResult[]) => {
    let classes = LI_STYLE;
    if (idx != arr.length - 1) {
      classes += " border-b";
    }
    return (
      <li
        className={classes}
        key={"search:" + idx}
        onClick={(_) => props.onItemClick(result)}>
        <p>{ result.title }</p>
        <p className="text-gray-600 text-xs">{ result.description }</p>
      </li>
    )
  })

  if (props.results.length == 0) {
    const forTerm = props.state.lastSearch ? `for ${props.state.lastSearch}` : "";
    return (<p className="px-1 py-2">No results {forTerm}</p>);
  } else {
    return (<ul className={SEARCH_STYLE}>{resultList}</ul>);
  }
}