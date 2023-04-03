/**
 * Typescript code consisting of a Modal component and a ModalStack class.
 * The Modal component renders a reusable modal with a transparent overlay background.
 * The ModalStack class manages an array of modals and allows adding and removing of modals.
 */

import React, {CSSProperties, Dispatch, ReactNode, useEffect, useRef, useState} from "react";

/**
 * Type for mouse events on a div element
 */
type MouseDivEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;

/**
 * Props for the Modal component
 * @param closeMenu - function to close the modal
 * @param children - the children to render within the modal
 */
type ModalProps = {
  closeMenu: () => void;
  children: ReactNode;
};

/**
 * The Modal component to render a reusable modal with overlay background
 * @param props - the ModalProps object containing the closeMenu function and children
 */
const Modal = (props: ModalProps) => {

  // Id for the modal overlay div element
  const idModalOverlay = "modal-overlay";

  // Reference for the children div element within the modal
  const childrenRef = useRef(null);

  // State for the modal's position style properties
  const [popupStyle, setPopupStyle] = useState({
    position: "absolute",
    top: 0,
    left: 0,
    visibility: "hidden"
  } as CSSProperties);

  // Create the children element with refs
  const children = (
    <div ref={childrenRef}>
      {props.children}
    </div>
  );

  // Use effect to center the modal vertically and horizontally
  useEffect(() => {
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

  // Style properties for the modal overlay element
  const overlayStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
  }

  // Function to handle click events on the modal overlay element
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

/**
 * The ModalStack class manages an array of modals and provides methods to add and remove modals
 */
export class ModalStack {
  /**
   * The array of modals in the stack
   */
  private readonly theStack: JSX.Element[];

  /**
   * The function to set the array of modals
   */
  private readonly setTheStack: Dispatch<any>;

  /**
   * Constructor for the ModalStack class
   * @param theStack - the initial array of modals to manage
   * @param setTheStack - the function to set the array of modals
   */
  constructor(theStack: JSX.Element[], setTheStack: Dispatch<any>) {
    this.theStack = theStack;
    this.setTheStack = setTheStack;
  }

  /**
   * Gets the current modal in the stack
   * @returns the current modal JSX Element or an empty JSX Element if the stack is empty
   */
  getCurrent = (): JSX.Element => {
    if (this.theStack.length > 0) {
      return this.theStack[0];
    }
    return (<></>);
  }

  /**
   * Adds a new modal to the stack
   * @param newElement - the JSX Element of the new modal to add
   */
  push = (newElement: JSX.Element) => {
    this.theStack.push(newElement);
    this.setTheStack(this.theStack);
  }

  /**
   * Removes the current modal from the stack
   */
  pop = () => {
    if (this.theStack.length > 0) {
      this.theStack.splice(0, 1);
      this.setTheStack(this.theStack);
    }
  }
}

export default Modal;