import {Button, Modal} from "flowbite-react";
import {HiOutlineExclamationCircle, HiOutlineInformationCircle, HiExclamation, HiOutlineQuestionMarkCircle} from "react-icons/hi";
import {makeString} from "../services/Logger";

enum AlertType {
  Error = 0,
  Information = 1,
  Warning = 2,
  Question = 3,
}

class AlertManager {
  message: string = "";

  show: boolean = false;

  type: AlertType = AlertType.Information;

  private setAlertVisible?: ((visible: boolean) => void);
  private onOk?: (() => void);

  setStateFunction = (setAlertVisible: ((visible: boolean) => void)) => {
    this.setAlertVisible = setAlertVisible;
  }

  showAlert = (message: any, type: AlertType, onOk?: (() => void)) => {
    this.type = type;
    this.show = true;
    this.onOk = onOk;
    this.message = makeString(message);

    if (this.setAlertVisible !== undefined) {
      this.setAlertVisible(true);
    }
  }

  hideAlert = () => {
    this.show = false;
    if (this.setAlertVisible !== undefined) {
      this.setAlertVisible(false);
    }
  }

  okClicked = () => {
    if (this.onOk !== undefined) {
      this.onOk();
      this.onOk = undefined;
    }
    this.hideAlert();
  }
}

export const gAlertManager = new AlertManager();

export const showErrorAlert = (message: string) => {
  showAlert(message, AlertType.Error);
}

export const showWarningAlert = (message: string) => {
  showAlert(message, AlertType.Warning);
}

export const showInfoAlert = (message: string) => {
  showAlert(message, AlertType.Information);
}

export const showQuestionAlert = (message: string, onOk?: (() => void)) => {
  showAlert(message, AlertType.Question, onOk);
}


const showAlert = (message: string, type: AlertType, onOk?: (() => void)) => {
  if (gAlertManager !== undefined) {
    gAlertManager.showAlert(message, type, onOk);
  } else if (onOk !== undefined) {
    throw "onOk cannot be set if no global AlertManager has been set";
  } else {
    alert(message);
  }
}

type AlertConfig = {
  show: boolean;
}

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
    <Modal show={props.show} size="md" popup={true}>
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