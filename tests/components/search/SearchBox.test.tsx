import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import { SE_PIRATEBAY, SE_YOUTUBE } from '../../../src/domain/Constants';
import { SearchBox } from '../../../src/components/Search/SearchBox';
import { ActionKind } from "../../../src/components/Search/Reducer";

const defaultState = { term: '', engine: SE_PIRATEBAY };

const dispatch = jest.fn();

const doSearch = jest.fn();

describe('SearchBox', () => {
  it('should render without errors', () => {
    render(<SearchBox state={defaultState} dispatch={dispatch} doSearch={doSearch} />);
  });

  it('should update term when input is changed', () => {
    const { getByPlaceholderText } = render(
      <SearchBox state={defaultState} dispatch={dispatch} doSearch={doSearch} />
    );
    const input = getByPlaceholderText('SearchTab');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(dispatch).toHaveBeenCalledWith({ type: ActionKind.TERM, payload: 'test' });
  });

  it('should update engine when radio button is changed', async () => {
    const { getByLabelText } = await waitFor(() => {
      return render(
        <SearchBox state={defaultState} dispatch={dispatch} doSearch={doSearch} />
    )});
    const youTubeRadio = getByLabelText('YouTube');
    fireEvent.click(youTubeRadio);
    expect(dispatch).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith({ type: ActionKind.ENGINE, payload: SE_YOUTUBE });
  });

  it('should call doSearch when form is submitted', async () => {
    const { debug, getByRole } = await waitFor(() => render(
      <SearchBox state={{ term: 'test', engine: SE_PIRATEBAY }} dispatch={dispatch} doSearch={doSearch} />
    ));
    const form = getByRole('button').parentElement.parentElement;
    fireEvent.submit(form);
    expect(doSearch).toHaveBeenCalledWith('test', SE_PIRATEBAY);
  });
});
