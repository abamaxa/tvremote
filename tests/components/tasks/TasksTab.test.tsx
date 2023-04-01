import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RestAdaptor } from "../../../src/adaptors/RestAdaptor";
import { TaskType, TaskState } from "../../../src/domain/Messages";
import { TasksTab } from "../../../src/components/Tasks/TasksTab";
import { mock, MockProxy } from 'jest-mock-extended';

describe("TasksTab", () => {
  const mockTasks: TaskState[] = [
    {
      key: "Task 1",
      name: "abc",
      displayName: "A B C",
      finished: true,
      eta: 0,
      percentDone: 1.0,
      sizeDetails: "",
      rateDetails: "",
      processDetails: "",
      errorString: "",
      taskType: TaskType.AsyncProcess,
    }
  ];

  let mockHost: MockProxy<RestAdaptor>;

  beforeEach(() => {
    jest.spyOn(global, "setInterval").mockImplementation((cb: any) => cb());
    jest.spyOn(global, "clearInterval");

    mockHost = mock<RestAdaptor>();
    mockHost.get.mockReturnValue(
      new Promise((resolve) => {
        resolve({"results" :mockTasks})
      }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should render list of tasks", async () => {
    await waitFor(() => render(<TasksTab host={mockHost} isActive={true} />));
    for (const task of mockTasks) {
      const taskNames = screen.getAllByText(task.displayName);
      expect(taskNames.length).toBeGreaterThanOrEqual(1);
      taskNames.forEach(taskName => {
        expect(taskName).toBeInTheDocument();
      });
    }
  });

  it("should not render tasks when there are no results", () => {
    mockHost.get.mockReturnValue(
      new Promise((resolve) => {
        resolve({"results" :[]})
      }));

    render(<TasksTab host={mockHost} isActive={false} />);
    const noResults = screen.getByText("No results");
    expect(noResults).toBeInTheDocument();
  });

  it("should not call list when not active", () => {
    const listSpy = jest.fn();
    render(<TasksTab host={mockHost} isActive={false} />);
    expect(listSpy).not.toHaveBeenCalled();
  });

  it("should call clearInterval when unmounted", () => {
    const clearIntervalSpy = jest.spyOn(global, "clearInterval");
    const { unmount } = render(
      <TasksTab host={mockHost} isActive={true} />
    );
    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
