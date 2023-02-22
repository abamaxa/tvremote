import {DownloadingItem} from "../domain/Messages";
import {LI_STYLE, UL_STYLE} from "../domain/Constants";
import {useEffect, useState, MouseEvent} from "react";
import {DownloadManager} from "../services/Download";
import {RestAdaptor} from "../adaptors/RestAdaptor";


type DownloadsConfig = {
  host: RestAdaptor;
  isActive: boolean;
}

export const Downloads = (props: DownloadsConfig) => {

  const [downloadResults, setDownloadResults] = useState([] as DownloadingItem[]);

  useEffect(() => {
    if (props.isActive) {
      let searchEngine = new DownloadManager(props.host);

      searchEngine.list(setDownloadResults);

      const interval = setInterval(() => {
        searchEngine.list(setDownloadResults);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [props.isActive]);

  const onItemClick = (item: DownloadingItem) => {
    console.log(`onItemClick: ${item}`);
  }

  return (
    <div className="p-0">
      <DownloadList  results={downloadResults} onItemClick={onItemClick}/>
    </div>
  )
}

type DownloadListConfig = {
  results: DownloadingItem[];

  onItemClick: ((item: DownloadingItem) => void);
};


const DownloadList = (props: DownloadListConfig) => {

  const onItemClick = (item: DownloadingItem, e: MouseEvent<HTMLLIElement>) => {
    console.log(`onItemClick: ${item}, ${e}`)
  }

  const downloadingItems = props.results.map((result: DownloadingItem, idx: number, arr:DownloadingItem[]) => {
    let classes = LI_STYLE;
    if (idx != arr.length - 1) {
      classes += " border-b";
    }
    return (
      <li className={classes} key={"search:" + idx} onClick={(e) => onItemClick(result, e)}>
        <p>{ result.name }</p>
        <p className="text-gray-600 text-xs">
          Size: {result.downloadedSize}/{result.totalSize}&nbsp;
          Eta: {result.eta} secs ({result.percentDone * 100}&#37;)&nbsp;
        </p>
        <p className="text-gray-600 text-xs">
          Rate: {result.rateDownload}/{result.rateUpload}&nbsp;
          Peers: {result.peersConnected} ({result.peersSendingToUs}/{result.peersGettingFromUs})
        </p>
      </li>
    )
  })

  return (<ul className={UL_STYLE}>{ downloadingItems }</ul>)
}