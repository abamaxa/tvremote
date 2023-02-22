import {useEffect, useState} from "react";
import {VideoEntry} from "../src/domain/Messages";
import {VideoPlayer} from "../src/services/Player";
import Head from "next/head";
import {VideoEntryList} from "../src/components/VideoEntryList";
import {ControlBar} from "../src/components/ControlBar";
import {RestAdaptor} from "../src/adaptors/RestAdaptor";

type HomePageConfig = {
  host: RestAdaptor;
}

const HomePage = (props: HomePageConfig) => {

  const [collections, setCollection] = useState(new VideoEntry());
  const [currentCollection, setCurrentCollection] = useState("");
  const [parentCollection, setParentCollection] = useState("");

  const videoPlayer = new VideoPlayer(currentCollection, props.host, "");

  useEffect(() => {
    videoPlayer.fetchCollection()
      .then((res) => res.json())
      .then((data) => {
        setCollection(data)
        setParentCollection(data.parent_collection)
      })
      .catch((err) => {
        console.log(err)
        alert(err);
      })
  }, [currentCollection])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Videos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex w-full flex-1 flex-col items-left justify-left px-2">
        <button type="button" onClick={() => setCurrentCollection(parentCollection)}>
          Back
        </button>
        <VideoEntryList
          entry={collections}
          setCurrentCollection={setCurrentCollection}
          playVideo={videoPlayer.playVideo}
        />
      </main>
      <ControlBar player={videoPlayer} />
    </div>
  )
}

export default HomePage;
