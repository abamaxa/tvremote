import type { NextPage } from 'next'
import VideoControlPage from "./VideoControlPage";
import {createLogger} from "../src/services/Logger";
import {useEffect, useState} from "react";
import {HTTPRestAdaptor, RestAdaptor} from "../src/adaptors/RestAdaptor";
import {MainTab} from "../src/components/MainTab";

// const host: RestAdaptor = new HTTPRestAdaptor("coco.abamaxa.com");
const host: RestAdaptor = new HTTPRestAdaptor("higo.abamaxa.com");
// const host: RestAdaptor = new HTTPRestAdaptor("localhost:4000");

createLogger(host);


enum Mode {
  Unknown = 1,
  Video,
  Remote,
}


const Home: NextPage = () => {

  const [mode, setMode] = useState(Mode.Unknown);

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    if (userAgent.includes("SMART-TV") || userAgent.includes("Firefox/109")) {
      setMode(Mode.Video)
    } else {
      setMode(Mode.Remote)
    }
  }, [])

  if (mode == Mode.Video) {
    return (<VideoControlPage host={host}/>)
  } else if (mode == Mode.Remote) {
    return (<MainTab host={host}/>)
  } else {
    return (<p>Loading...</p>)
  }
}

export default Home