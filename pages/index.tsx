import type { NextPage } from 'next'
import Viewer from "@/components/Viewer/Viewer";
import {createLogger, log_info} from "@/services/Logger";
import {useEffect, useState} from "react";
import {HTTPRestAdaptor, RestAdaptor} from "@/adaptors/RestAdaptor";
import {Main} from "@/components/Main";
import {API_URL} from "@/config/constants";

const host: RestAdaptor = new HTTPRestAdaptor(API_URL);

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
    const url = new URLSearchParams(location.search);

    if (userAgent.includes("SMART-TV") || userAgent.includes("SmartTV") || url.has("player")) {
      log_info(`detected smart-tv: ${userAgent}, ${url}`);
      setMode(Mode.Video)
    } else {
      log_info(`detected normal browser: ${userAgent}`);
      setMode(Mode.Remote)
    }
  }, [])

  if (mode == Mode.Video) {
    return (<Viewer host={host}/>)
  } else if (mode == Mode.Remote) {
    return (<Main host={host}/>)
  } else {
    return (<p>Loading...</p>)
  }
}

export default Home