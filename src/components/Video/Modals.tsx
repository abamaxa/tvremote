import React, {ChangeEvent, ChangeEventHandler, useEffect, useState} from "react";
import {showWarningAlert} from "../Base/Alert";
import {Button, Label, Radio, Select, TextInput} from "flowbite-react";
import Modal from "../Base/Modal";
import {Player} from "../../services/Player";
import {Conversion} from "../../domain/Messages";
import {log_error} from "../../services/Logger";

type MouseButtonEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;
type RadioEvent = React.ChangeEvent<HTMLInputElement>;

type VideoModalProps = {
  onClose: () => void;
  video: string;
  player: Player;
}
export const Modals = (props: VideoModalProps) => {
  const [newName, setNewName] = useState('');

  const renameVideo = async (e: MouseButtonEvent) => {

    e.preventDefault();

    if (newName === "") {
      showWarningAlert("Must enter a new name");
      return;
    }

    props.onClose();

    await props.player.renameVideo(props.video, newName);
  }

  return (
    <Modal closeMenu={props.onClose}>
      <div className="p-4">
        <div className="mb-2">
          <div className="mb-2 block">
            <Label htmlFor="newName" value="New Name"/>
          </div>
          <TextInput
            id="newName"
            placeholder={props.video}
            value={newName}
            onChange={e => setNewName(e.target.value)}
            required={true}
          />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button onClick={(e) => renameVideo(e)}>Ok</Button>
          <Button outline={true} onClick={props.onClose}>Cancel</Button>
        </div>
      </div>
    </Modal>
  )
}

export const ConvertModal = (props: VideoModalProps) => {

  const [conversion, setConversion] = useState('');
  const [availableConversions, setAvailableConversions] = useState<Conversion[]>([]);

  useEffect(() => {
    const getConversions = async () => {
      const items = await props.player.getAvailableConversions()
      if (items.length > 0) {
        setConversion(items[0].name);
      }
      return setAvailableConversions(items);
    }

    getConversions().catch((e) => log_error(e));

  }, [props.player]);

  const convertVideo = async (e: MouseButtonEvent) => {
    if (conversion === "") {
      showWarningAlert("Select a conversion method");
      return;
    }

    props.onClose();

    await props.player.convertVideo(props.video, conversion);
  }

  const onConversionSelect = (e: RadioEvent) => {
    const target = e.currentTarget;
    setConversion(target.value);
  }

  const conversionsList = availableConversions.map((item, index) => {
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
    <Modal closeMenu={props.onClose}>
      <div className="p-4">
        <div className="mb-2">
          <div className="mb-2 block">
            <Label htmlFor="conversion" value="Convert Video"/>
          </div>
          <div className="flex flex-col gap-4">
            {conversionsList}
          </div>
        </div>
        <div className="flex pt-4 flex-wrap items-center gap-4">
          <Button onClick={(e) => convertVideo(e)}>Ok</Button>
          <Button outline={true} onClick={props.onClose}>Cancel</Button>
        </div>
      </div>
    </Modal>
  )
}