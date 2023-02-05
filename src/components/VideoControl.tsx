import React from "react";

type VideoControlProps = {
  url: string;
}

export const VideoControl = (props: VideoControlProps) => {

  const playFullScreen = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video: HTMLVideoElement = e.currentTarget;
    video.requestFullscreen().then(r => console.log(`requestFullscreen: ${r}`)).catch(r => console.log(`failed: ${r}`));
    video.className ="w-full";
  }

  return (
    <div className="bg-black h-screen w-screen">
      <video
        className="h-screen m-auto"
        style={{objectFit: "contain"}}
        id="video"
        autoPlay={true}
        controls
        muted={false}
        playsInline={false}
        src={props.url}
      >
      </video>
    </div>
  )
};
