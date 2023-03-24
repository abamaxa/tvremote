import React, {CSSProperties, ReactNode, useEffect, useRef, useState} from "react";

type MouseDivEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;

type PopupMenuProps = {
  closeMenu: () => void;
  children: ReactNode;
  target: HTMLElement;
  scrollTop?: number;
};

const PopupMenu = (props: PopupMenuProps) => {
  const idPopupOverlay = "popup-menu-overlay"

  const scrollTop = props.scrollTop !== undefined ? props.scrollTop : 0;
  const childrenRef = useRef(null);
  const [popupStyle, setPopupStyle] = useState({
    position: "absolute",
    width: `${props.target.clientWidth + 4}px`,
    top: `${props.target.offsetTop + props.target.clientHeight - scrollTop - 4}px`,
    left: `${props.target.offsetLeft - 2}px`,
  } as CSSProperties);

  const children = (
    <div ref={childrenRef}>
      {props.children}
    </div>
  );

  useEffect(() => {
    const element = childrenRef.current as unknown as HTMLElement;
    const top = props.target.offsetTop - scrollTop;
    if (element.clientHeight + top + props.target.clientHeight > window.innerHeight) {
      setPopupStyle({
        position: "absolute",
        width: `${props.target.clientWidth + 4}px`,
        top: `${top - element.clientHeight + 4}px`,
        left: `${props.target.offsetLeft - 2}px`,
      });
    }
  }, [scrollTop, props.target.clientHeight, props.target.clientWidth, props.target.offsetLeft, props.target.offsetTop]);

  const overlayStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
  }

  const onClick = (e: MouseDivEvent) => {
    // @ts-ignore
    if (e.target?.id === idPopupOverlay) {
      props.closeMenu();
    }
  }

  return (
    <div id={idPopupOverlay} style={overlayStyle} className="h-screen w-screen bg-gray-900 bg-opacity-50 dark:bg-opacity-80" onClick={onClick} >
      <div style={popupStyle} className="h-auto w-fit z-20 shadow transition-opacity duration-100 rounded divide-y divide-gray-100 border border-gray-600 bg-white text-gray-900 dark:border-none dark:bg-gray-700 dark:text-white">
        { children }
      </div>
    </div>
  );
}

export default PopupMenu;