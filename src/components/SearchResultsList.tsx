import { SearchResult } from '../domain/Messages';
import {LI_STYLE, UL_STYLE} from "../domain/Constants";

type SearchResultsConfig = {
  results: SearchResult[];

  onItemClick: ((item: SearchResult) => void);
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

  return (
    <ul className={SEARCH_STYLE}>{resultList}</ul>
  )
}