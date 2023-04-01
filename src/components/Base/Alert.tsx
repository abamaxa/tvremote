/**
 * Enum representing different types of alerts.
 */
enum AlertType {
  Error = 0,
  Information = 1,
  Warning = 2,
  Question = 3,
}

/**
 * Class representing an AlertManager to handle alert states and functions.
 */
class AlertManager {
  /**
   * Message to be displayed in the alert box.
   */
  message: string = "";

  /**
   * Boolean value indicating whether the alert box is visible or hidden.
   */
  show: boolean = false;

  /**
   * Type of the alert.
   */
  type: AlertType = AlertType.Information;

  /**
   * Function to set the visibility state of the alert box.
   * 
   * @param setAlertVisible - Callback function to set the visibility state of the alert box.
   */
  private setAlertVisible?: ((visible: boolean) => void);

  /**
   * Callback function to be executed when the user clicks on the 'Ok' button of the alert box.
   */
  private onOk?: (() => void);

  /**
   * Function to set the state of the alert box's visibility.
   * 
   * @param setAlertVisible - Callback function to set the visibility state of the alert box.
   */
  setStateFunction = (setAlertVisible: ((visible: boolean) => void)) => {
    this.setAlertVisible = setAlertVisible;
  }

  /**
   * Function to display an alert box.
   * 
   * @param message - Message to be displayed in the alert box.
   * @param type - Type of the alert box.
   * @param onOk - Callback function to be executed when the user clicks on the 'Ok' button of the alert box.
   */
  showAlert = (message: any, type: AlertType, onOk?: (() => void)) => {
    this.type = type;
    this.show = true;
    this.onOk = onOk;
    this.message = makeString(message);

    if (this.setAlertVisible !== undefined) {
      this.setAlertVisible(true);
    }
  }

  /**
   * Function to hide the alert box.
   */
  hideAlert = () => {
    this.show = false;
    if (this.setAlertVisible !== undefined) {
      this.setAlertVisible(false);
    }
  }

  /**
   * Function to handle the 'Ok' button click of the alert box.
   */
  okClicked = () => {
    const onOk = this.onOk;
    this.onOk = undefined;

    this.hideAlert();

    if (onOk !== undefined) {
      onOk();
    }
  }
}

/**
 * Global instance of the AlertManager.
 */
export const gAlertManager = new AlertManager();

/**
 * Function to display an error alert box.
 * 
 * @param message - Message to be displayed in the alert box.
 */
export const showErrorAlert = (message: string) => {
  showAlert(message, AlertType.Error);
}

/**
 * Function to display a warning alert box.
 * 
 * @param message - Message to be displayed in the alert box.
 */
export const showWarningAlert = (message: string) => {
  showAlert(message, AlertType.Warning);
}

/**
 * Function to display an information alert box.
 * 
 * @param message - Message to be displayed in the alert box.
 */
export const showInfoAlert = (message: string) => {
  showAlert(message, AlertType.Information);
}

/**
 * Function to display a question alert box.
 * 
 * @param message - Message to be displayed in the alert box.
 * @param onOk - Callback function to be executed when the user clicks on the 'Ok' button of the alert box.
 */
export function askQuestion(message: string, onOk?: (() => void)) {
  showAlert(message, AlertType.Question, onOk);
}

/**
 * Function to display an alert box.
 * 
 * @param message - Message to be displayed in the alert box.
 * @param type - Type of the alert box.
 * @param onOk - Callback function to be executed when the user clicks on the 'Ok' button of the alert box.
 */
const showAlert = (message: string, type: AlertType, onOk?: (() => void)) => {
  if (gAlertManager !== undefined) {
    gAlertManager.showAlert(message, type, onOk);
  } else if (onOk !== undefined) {
    throw "onOk cannot be set if no global AlertManager has been set";
  } else {
    alert(message);
  }
}

/**
 * Interface representing the configuration of the Alert component.
 */
type AlertConfig = {
  /**
   * Boolean value indicating whether the alert box is visible or hidden.
   */
  show: boolean;
}

/**
 * Component representing an alert box.
 * 
 * @param props - Configuration object for the Alert component.
 */
export const Alert = (props: AlertConfig) => {
  const iconClasses = "mx-auto mb-4 h-14 w-14 ";
  let icon;
  let extraButton = null;

  if (gAlertManager.type === AlertType.Information) {
    icon = (<HiOutlineInformationCircle className={iconClasses + "text-gray-400 dark:text-gray-200"}/>);
  } else if (gAlertManager.type === AlertType.Error) {
    icon = (<HiOutlineExclamationCircle className={iconClasses + "text-red-400 dark:text-red-200"} />);
  } else if (gAlertManager.type === AlertType.Question) {
    icon = (<HiOutlineQuestionMarkCircle className={iconClasses + "text-blue-400 dark:text-blue-200"} />);
    extraButton = (
      <Button outline={true} onClick={() => gAlertManager.hideAlert()}>
        Cancel
      </Button>
    )
  } else {
    icon = (<HiExclamation className={iconClasses + "text-yellow-400 dark:text-yellow-200"} />);
  }

  return (
    <Modal className="z-50" show={props.show} size="md" popup={true}>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          { icon }
          <h3 className="mb-5 overflow-hidden text-lg font-normal text-gray-500 dark:text-gray-400">
            {gAlertManager.message}
          </h3>
          <div className="flex justify-center gap-4">
            <Button onClick={() => gAlertManager.okClicked()}>
              Ok
            </Button>
            { extraButton }
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}