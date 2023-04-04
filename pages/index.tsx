import type { NextPage } from 'next'
import VideoControlPage from "./VideoControlPage";
import {createLogger} from "../src/services/Logger";
import {useEffect, useState} from "react";
import {HTTPRestAdaptor, RestAdaptor} from "../src/adaptors/RestAdaptor";
import {Main} from "../src/components/Main";

const host: RestAdaptor = new HTTPRestAdaptor("localhost");

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
    if (userAgent.includes("SMART-TV")) {
      setMode(Mode.Video)
    } else {
      setMode(Mode.Remote)
    }
  }, [])

  if (mode == Mode.Video) {
    return (<VideoControlPage host={host}/>)
  } else if (mode == Mode.Remote) {
    return (<Main host={host}/>)
  } else {
    return (<p>Loading...</p>)
  }
}

export default Home