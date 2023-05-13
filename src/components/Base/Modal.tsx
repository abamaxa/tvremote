/**
 * Typescript code consisting of a Modal component and a ModalStack class.
 * The Modal component renders a reusable modal with a transparent overlay background.
 */

import React, {ReactNode} from "react";

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
  onClose: () => void;
  children: ReactNode;
  title? : string;
};

/**
 * The Modal component to render a reusable modal with overlay background
 * @param props - the ModalProps object containing the closeMenu function and children
 */
const Modal = (props: ModalProps) => {

  // Id for the modal overlay div element
  const idModalOverlay = "modal-overlay";

  // Function to handle click events on the modal overlay element
  const onClick = (e: MouseDivEvent) => {
    // @ts-ignore
    if (e.target?.id === idModalOverlay) {
      props.onClose();
    }
  }
  // h-auto mb-auto p-1 overflow-y-auto
  return (
    <div
      id={idModalOverlay}
      className="z-30 fixed top-0 left-0 mb-auto h-fill-viewport w-full bg-gray-900 bg-opacity-50 dark:bg-opacity-80"
      onClick={onClick} >
      <div
        className="z-35 inset-x-0 max-w-max mx-auto flex flex-col fixed top-8 h-max max-h-screen shadow transition-opacity duration-100 rounded divide-y divide-gray-100 border border-gray-600 bg-white text-gray-900 dark:border-none dark:bg-gray-700 dark:text-white">
        <div className="flex items-start justify-between bg-gray-50 rounded-t dark:border-gray-600 border-b p-2">
          <h3 className="mt-1 ml-1 text-l font-medium text-gray-900 dark:text-white">
            { props.title }
          </h3>
          <button aria-label="Close"
                  className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                  type="button"
                  onClick={(_) => props.onClose()}
          >
            <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 24 24" aria-hidden="true"
                 className="h-5 w-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="mb-auto overflow-y-scroll">
          {props.children}
        </div>
      </div>
    </div>
  );
}

export default Modal;


type CardModalProps = {
  title: string;
  children: ReactNode;
  onClose: (() => void);
}

export const CardModal = (props: CardModalProps): JSX.Element => {
  return (
    <Modal onClose={props.onClose} title={props.title}>
      <div className="p-2">
        { props.children }
      </div>
    </Modal>
  )
}
