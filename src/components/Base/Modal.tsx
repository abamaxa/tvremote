import React, {CSSProperties, Dispatch, ReactNode, useEffect, useRef, useState} from "react";

type MouseDivEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;

type ModalProps = {
  closeMenu: () => void;
  children: ReactNode;
};

const Modal = (props: ModalProps) => {
  const idModalOverlay = "modal-overlay";
  const childrenRef = useRef(null);
  const [popupStyle, setPopupStyle] = useState({
    position: "absolute",
    top: 0,
    left: 0,
    visibility: "hidden"
  } as CSSProperties);

  const children = (
    <div ref={childrenRef}>
      {props.children}
    </div>
  );

  useEffect(() => {
    /*
    Centers the modal vertically and horizontally
     */
    const element = childrenRef.current as unknown as HTMLElement;
    const height = window.innerHeight;
    const width = window.innerWidth;

    setPopupStyle({
      position: "absolute",
      top: (height - element.offsetHeight) / 2,
      left: (width - element.offsetWidth) / 2,
      visibility: "visible"
    });
  }, [childrenRef]);

  const overlayStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
  }

  const onClick = (e: MouseDivEvent) => {
    // @ts-ignore
    if (e.target?.id === idModalOverlay) {
      props.closeMenu();
    }
  }

  return (
    <div id={idModalOverlay} style={overlayStyle} className="h-screen w-screen bg-gray-900 bg-opacity-50 dark:bg-opacity-80" onClick={onClick} >
      <div style={popupStyle} className="h-auto w-fit z-20 shadow transition-opacity duration-100 rounded divide-y divide-gray-100 border border-gray-600 bg-white text-gray-900 dark:border-none dark:bg-gray-700 dark:text-white">
        { children }
      </div>
    </div>
  );
}

export class ModalStack {
  private readonly theStack: JSX.Element[];
  private readonly setTheStack: Dispatch<any>;

  constructor(theStack: JSX.Element[], setTheStack: Dispatch<any>) {
    this.theStack = theStack;
    this.setTheStack = setTheStack;
  }

  getCurrent = (): JSX.Element => {
    if (this.theStack.length > 0) {
      return this.theStack[0];
    }
    return (<></>);
  }

  push = (newElement: JSX.Element) => {
    this.theStack.push(newElement);
    this.setTheStack(this.theStack);
  }

  pop = () => {
    if (this.theStack.length > 0) {
      this.theStack.splice(0, 1);
      this.setTheStack(this.theStack);
    }
  }
}

export default Modal;