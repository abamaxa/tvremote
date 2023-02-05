import React from "react";

type VideoPlayer = {
  executeCommand: (command: string) => void;
}

type ControlButtonProps = {
  children?: React.ReactNode;
  ariaLabel?: string;
  onClick: () => void;
}

const ControlButton = (props: ControlButtonProps) => {
  return (
    <button type="button"
            className="border rounded-full"
            aria-label="Rewind 10 seconds"
            onClick={() => props.onClick()}>
      <svg width="72px" viewBox="-6 -6 36 36">
        {props.children}
      </svg>
    </button>
  )
}

/*
        <ControlButton ariaLabel="Previous" onClick={() => player.executeCommand('previous')}>
          <path d="m10 12 8-6v12l-8-6Z" fill="currentColor" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"/>
          <path d="M6 6v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </ControlButton>

        <ControlButton ariaLabel="Next" onClick={() => player.executeCommand('seek +10')}>
          <path d="M14 12 6 6v12l8-6Z" fill="currentColor" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"/>
          <path d="M18 6v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </ControlButton>
 */

export const ControlBar = (player: VideoPlayer) => {

  return (
    <footer className="flex h-24 w-full items-center justify-center border-t">
      <div className="flex-auto flex items-center justify-evenly">
        <ControlButton ariaLabel="Rewind 10 seconds" onClick={() => player.executeCommand('seek -10')}>
          <path fillRule="evenodd" clipRule="evenodd" fillOpacity="0.0"
                d="M6.492 16.95c2.861 2.733 7.5 2.733 10.362 0 2.861-2.734 2.861-7.166 0-9.9-2.862-2.733-7.501-2.733-10.362 0A7.096 7.096 0 0 0 5.5 8.226"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path
            d="M5 5v3.111c0 .491.398.889.889.889H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            strokeLinejoin="round"/>
        </ControlButton>
      </div>
      <button type="button"
              onClick={() => player.executeCommand('pause')}
              className="bg-white text-slate-900 dark:bg-slate-100 dark:text-slate-700 flex-none -my-2 mx-auto w-20 h-20 rounded-full ring-1 ring-slate-900/5 shadow-md flex items-center justify-center"
              aria-label="Pause">
        <svg width="30" height="32" fill="currentColor">
          <rect x="6" y="4" width="4" height="24" rx="2"/>
          <rect x="20" y="4" width="4" height="24" rx="2"/>
        </svg>
      </button>
      <div className="flex-auto flex items-center justify-evenly">
        <ControlButton ariaLabel="Skip 10 seconds" onClick={() => player.executeCommand('seek +10')}>
          <path fillOpacity="0.0"
            d="M17.509 16.95c-2.862 2.733-7.501 2.733-10.363 0-2.861-2.734-2.861-7.166 0-9.9 2.862-2.733 7.501-2.733 10.363 0 .38.365.711.759.991 1.176"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19 5v3.111c0 .491-.398.889-.889.889H15" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"/>
        </ControlButton>
      </div>
    </footer>
  )
}
