import React from "react";
import { mock } from 'jest-mock-extended';
import { render, fireEvent, screen } from "@testing-library/react";
import { ControlBar, ControlButton } from "../../src/components/ControlBar";
import { Player } from "../../src/services/Player";
import { HiPlayPause } from "react-icons/hi2";


describe("ControlBar component", () => {
  let player: Player;

  beforeEach(() => {
    player = mock<Player>();
  });

  it("should render three control buttons", () => {
    render(<ControlBar player={player} />);
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("should call the player.seek method with -15 when the previous button is clicked", () => {
    render(<ControlBar player={player} />);
    const buttons = screen.getAllByRole("button");
    const prevButton = buttons[0];
    fireEvent.click(prevButton);
    expect(player.seek).toHaveBeenCalledWith(-15);
  });

  it("should call the player.togglePause method when the play/pause button is clicked", () => {
    render(<ControlBar player={player} />);
    const buttons = screen.getAllByRole("button");
    const playPauseButton = buttons[1];
    fireEvent.click(playPauseButton);
    expect(player.togglePause).toHaveBeenCalled();
  });

  it("should call the player.seek method with 15 when the next button is clicked", () => {
    render(<ControlBar player={player} />);
    const buttons = screen.getAllByRole("button");
    const nextButton = buttons[2];
    fireEvent.click(nextButton);
    expect(player.seek).toHaveBeenCalledWith(15);
  });
});

describe("ControlButton component", () => {
  let onClickMock: jest.Mock;

  beforeEach(() => {
    onClickMock = jest.fn();
  });

  it("should call the onClick method when clicked", () => {
    render(<ControlButton onClick={onClickMock} iconClass={HiPlayPause} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(onClickMock).toHaveBeenCalled();
  });
});
