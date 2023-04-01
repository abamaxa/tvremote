/**
 * Defines properties of PopupMenu component, including closeMenu(), an optional scrollTop number,
 * and the element to which the popup menu is attached
 */
type PopupMenuProps = {
  closeMenu: () => void;
  children: ReactNode;
  target: HTMLElement;
  scrollTop?: number;
};

/**
 * Defines the shape of a mouse event with a target div element
 */
type MouseDivEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;

/**
 * Returns a popup menu React component with proper positioning, styling, and behavior.
 *
 * @param {PopupMenuProps} props - Properties of PopupMenu component, including closeMenu(), optional scrollTop,
 * and the element to which the popup menu is attached
 */
const PopupMenu = (props: PopupMenuProps) => {
  /**
   * ID of the popup overlay div element
   */
  const idPopupOverlay = "popup-menu-overlay";

  /**
   * Ref object for the div element that contains the children of the popup menu
   */
  const childrenRef = useRef(null);

  /**
   * Sets the style of the popup menu to position it next to the target element
   */
  const [popupStyle, setPopupStyle] = useState({
    position: "absolute",
    width: `${props.target.clientWidth + 4}px`,
    top: `${props.target.offsetTop + props.target.clientHeight - (props.scrollTop !== undefined ? props.scrollTop : 0) - 4}px`,
    left: `${props.target.offsetLeft - 2}px`,
  } as CSSProperties);

  /**
   * Stores the children ReactNode in a div element with related ref
   */
  const children = (
    <div ref={childrenRef}>
      {props.children}
    </div>
  );

  /**
   * Re-positions the popup menu if it is out of the viewport
   */
  useEffect(() => {
    const element = childrenRef.current as unknown as HTMLElement;
    const top = props.target.offsetTop - (props.scrollTop !== undefined ? props.scrollTop : 0);
    if (element.clientHeight + top + props.target.clientHeight > window.innerHeight) {
      setPopupStyle({
        position: "absolute",
        width: `${props.target.clientWidth + 4}px`,
        top: `${top - element.clientHeight + 4}px`,
        left: `${props.target.offsetLeft - 2}px`,
      });
    }
  }, [props.scrollTop, props.target.clientHeight, props.target.clientWidth, props.target.offsetLeft, props.target.offsetTop]);

  /**
   * Styles the overlay div element as a fullscreen darkening layer
   */
  const overlayStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
  }

  /**
   * Closes the popup menu when the overlay div is clicked
   */
  const onClick = (e: MouseDivEvent) => {
    // @ts-ignore
    if (e.target?.id === idPopupOverlay) {
      props.closeMenu();
    }
  }

  /**
   * Renders the popup menu with proper HTML structure and properties
   */
  return (
    <div
      id={idPopupOverlay}
      style={overlayStyle}
      className="h-screen w-screen bg-gray-900 bg-opacity-50 dark:bg-opacity-80"
      onClick={onClick}
    >
      <div
        style={popupStyle}
        className="h-auto w-fit z-20 shadow transition-opacity duration-100 rounded divide-y divide-gray-100 border border-gray-600 bg-white text-gray-900 dark:border-none dark:bg-gray-700 dark:text-white"
      >
        { children }
      </div>
    </div>
  );
}

export default PopupMenu;