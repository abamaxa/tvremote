import { TaskState } from '../../../src/domain/Messages';
import { TaskDetail, TaskDetails } from '../../../src/components/Tasks/TaskDetails';
import {render} from "@testing-library/react";

describe('TaskDetail', () => {
  it('should render a label and detail', () => {
    const label = 'Size';
    const detail = '123.45 MB';
    const { getByText } = render(<TaskDetail label={label} detail={detail} />);
    expect(getByText(`${label}: ${detail}`)).toBeInTheDocument();
  });

  it('should render a detail only', () => {
    const detail = 'Some details';
    const { getByText } = render(<TaskDetail detail={detail} />);
    expect(getByText(detail)).toBeInTheDocument();
  });
});

describe('TaskDetails', () => {
  const mockResult = {
    displayName: 'Test Task',
    finished: false,
    sizeDetails: '123.45 MB',
    eta: 1234,
    percentDone: 0.5,
    rateDetails: '123.45 KB/s',
    processDetails: 'Some process details',
  } as TaskState;

  it('should render a "Finished" detail if the task is finished', () => {
    const { getByText } = render(<TaskDetails result={{ ...mockResult, finished: true }} index={0} />);
    expect(getByText('Finished')).toBeInTheDocument();
  });

  it('should render details for size, ETA, rate, and process', () => {
    const { getByText } = render(<TaskDetails result={mockResult} index={0} />);
    expect(getByText('Size: 123.45 MB')).toBeInTheDocument();
    expect(getByText('Eta: 20 mins 34 secs (50.00%)')).toBeInTheDocument();
    expect(getByText('Rate: 123.45 KB/s')).toBeInTheDocument();
    expect(getByText('Some process details')).toBeInTheDocument();
  });

  it('should not render ETA detail if not provided', () => {
    const { queryByText } = render(<TaskDetails result={{ ...mockResult, eta: undefined }} index={0} />);
    expect(queryByText('Eta')).toBeNull();
  });

  it('should not render rate detail if not provided', () => {
    const { queryByText } = render(<TaskDetails result={{ ...mockResult, rateDetails: undefined }} index={0} />);
    expect(queryByText('Rate')).toBeNull();
  });

  it('should not render process detail if not provided', () => {
    const { queryByText } = render(<TaskDetails result={{ ...mockResult, processDetails: undefined }} index={0} />);
    expect(queryByText('Some process details')).toBeNull();
  });
});
