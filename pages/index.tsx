import { useState, useEffect } from "react";
import type { NextPage } from 'next'
import Head from 'next/head'
import {VideoEntry} from "../src/domain/VideoEntry";
import {VideoEntryList} from "../src/components/VideoEntryList";
import {VideoPlayer} from "../src/services/Player";
import {ControlBar} from "../src/components/ControlBar";
import {NavBar} from "../src/components/NavBar";
import {VideoControl} from "../src/components/VideoControl";

const host: string = "http://coco.abamaxa.com/";

const Home: NextPage = () => {

  const [collections, setCollection] = useState(new VideoEntry());
  const [currentCollection, setCurrentCollection] = useState("");
  const [parentCollection, setParentCollection] = useState("");
  const [isLoading, setLoading] = useState(false)

  const videoPlayer = new VideoPlayer(currentCollection, host);

  useEffect(() => {
    setLoading(true);
    videoPlayer.fetchCollection()
        .then((res) => res.json())
        .then((data) => {
          setCollection(data)
          setLoading(false)
          setParentCollection(data.parent_collection)
        })
        .catch((err) => {
          console.log(err)
          alert(err);
        })
  }, [currentCollection])

  return (
    <VideoControl url={`${host}stream/any.mp4`} />
  )
}

/*
    <HomePage
      videoPlayer={videoPlayer}
      collections={collections}
      setCurrentCollection={setCurrentCollection}
      parentCollection={parentCollection}
    />

 */

type HomePageProps = {
  videoPlayer: VideoPlayer;
  collections: VideoEntry;
  setCurrentCollection: (collection: string) => void;
  parentCollection: string;
}

const HomePage = (props: HomePageProps) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Videos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar></NavBar>
      <main className="flex w-full flex-1 flex-col items-left justify-left px-2">

        <button type="button" onClick={() => props.setCurrentCollection(props.parentCollection)}>
          Back
        </button>
        <VideoEntryList
          entry={props.collections}
          setCurrentCollection={props.setCurrentCollection}
          playVideo={props.videoPlayer.playVideo}
        />
      </main>

      <ControlBar executeCommand={props.videoPlayer.executeCommand} />
    </div>
  )
}

export default Home
