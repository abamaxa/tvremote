/**
 * Typescript module that exports two React components VideoModal and ConvertModal
 * @module Modals
 */
import React, { useEffect, useState } from "react";
import { showWarningAlert } from "../Base/Alert";
import { Button, Label, Radio, TextInput } from "flowbite-react";
import Modal from "../Base/Modal";
import { Player } from "../../services/Player";
import { Conversion } from "../../domain/Messages";
import { log_error } from "../../services/Logger";

/**
 * Interface representing Mouse Button Event of HTML Button Element
 * @interface MouseButtonEvent
 */
interface MouseButtonEvent extends React.MouseEvent<HTMLButtonElement, MouseEvent> { }

/**
 * Interface representing Radio Input Change Event
 * @interface RadioEvent
 */
interface RadioEvent extends React.ChangeEvent<HTMLInputElement> { }

/**
 * Interface representing Video Modal Props object
 * @interface VideoModalProps
 * @property {Function} onClose - Function that is triggered when the modal is closed
 * @property {String} video - The video string
 * @property {Object} player - Instance of Player class
 */
interface VideoModalProps {
  onClose: () => void;
  video: string;
  player: Player;
}

/**
 * React component that renders a modal for renaming a video
 * @function Modals
 * @param {Object} props - The props object
 * @returns {JSX.Element} Rendered component
 */
export const Modals = (props: VideoModalProps): JSX.Element => {
  const [newName, setNewName] = useState('');

  /**
   * A function that is triggered when the rename button is clicked
   * @async
   * @function renameVideo
   * @param {MouseButtonEvent} e - The event object
   * @returns {Void} Returns nothing
   */
  const renameVideo = async (e: MouseButtonEvent): Promise<void> => {
    e.preventDefault();

    if (newName === "") {
      showWarningAlert("Must enter a new name");
      return;
    }

    props.onClose();

    await props.player.renameVideo(props.video, newName);
  }

  return (
    <Modal onClose={props.onClose}>
      <div className="p-4">
        <div className="mb-2">
          <div className="mb-2 block">
            <Label htmlFor="newName" value="New Name" />
          </div>
          
          {/* Field to enter new name for the video */}
          <TextInput
            id="newName"
            placeholder={props.video}
            value={newName}
            onChange={e => setNewName(e.target.value)}
            required={true}
          />
        </div>
        
        {/* Buttons for Ok and Cancel */}
        <div className="flex flex-wrap items-center gap-4">
          <Button onClick={(e) => renameVideo(e)}>Ok</Button>
          <Button outline={true} onClick={props.onClose}>Cancel</Button>
        </div>
      </div>
    </Modal>
  )
}

/**
 * React component that renders a modal for selecting a conversion method for the video
 * @function ConvertModal
 * @param {Object} props - The props object
 * @returns {JSX.Element} Rendered component
 */
export const ConvertModal = (props: VideoModalProps): JSX.Element => {
  const [conversion, setConversion] = useState('');
  const [availableConversions, setAvailableConversions] = useState<Conversion[]>([]);

  /**
   * A function that is triggered when the component mounts, it fetches the available conversion methods
   * @async
   * @function useEffect
   * @returns {Void} Returns nothing
   */
  useEffect(() => {
    const getConversions = async () => {
      const items = await props.player.getAvailableConversions();

      // When available conversions are fetched, set the first conversion method as the default conversion method for the video
      if (items.length > 0) {
        setConversion(items[0].name);
      }

      return setAvailableConversions(items);
    }

    // Fetch the available conversions
    getConversions().catch((e) => log_error(e, "getConversions"));

  }, [props.player]);

  /**
   * A function that is triggered when the convert button is clicked
   * @async
   * @function convertVideo
   * @param {MouseButtonEvent} e - The event object
   * @returns {Void} Returns nothing
   */
  const convertVideo = async (e: MouseButtonEvent): Promise<void> => {
    if (conversion === "") {
      showWarningAlert("Select a conversion method");
      return;
    }

    props.onClose();

    await props.player.convertVideo(props.video, conversion);
  }

  /**
   * A function that is triggered when a radio input is clicked to select the conversion method
   * @function onConversionSelect
   * @param {RadioEvent} e - The event object
   * @returns {Void} Returns nothing
   */
  const onConversionSelect = (e: RadioEvent): void => {
    const target = e.currentTarget;
    setConversion(target.value);
  }

  // Create a list of radio inputs to display the available conversion methods
  const conversionsList = availableConversions.map((item: Conversion, index: number): JSX.Element => {
    return (
      <div key={index} className="flex items-center gap-2">
        <Radio
          id={item.name}
          name="conversion"
          value={item.name}
          defaultChecked={index === 0}
          onChange={onConversionSelect}
        />
        <Label htmlFor={item.name}>
          {item.name}
        </Label>
      </div>
    )
  });

  return (
    <Modal onClose={props.onClose}>
      <div className="p-4">
        <div className="mb-2">
          <div className="mb-2 block">
            <Label htmlFor="conversion" value="Convert Video" />
          </div>
          
          {/* List of available conversion methods */}
          <div className="flex flex-col gap-4 min-w-[16em]">
            {conversionsList}
          </div>
        </div>
        
        {/* Buttons for Ok and Cancel */}
        <div className="flex pt-4 flex-wrap items-center gap-4">
          <Button onClick={(e) => convertVideo(e)}>Ok</Button>
          <Button outline={true} onClick={props.onClose}>Cancel</Button>
        </div>
      </div>
    </Modal>
  )
}