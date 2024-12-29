import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../redux/store';
import MarksBreakupTable from './MarksBreakupTable';

describe('MarksBreakupTable component', () => {
  const mockHandleChangeMarks = jest.fn();
  const mockHandleMultiSelectChange = jest.fn();

  const tableData = [
    {
      part: 'Part A',
      section: 'Section 1',
      questionNo: 'Q1',
      subQuestionNo: '1a',
      obtainedMarks: '5',
      actualMarks: '10',
      error: [
        { errorId: 1, error: 'Error 1', isSelected: true },
        { errorId: 2, error: 'Error 2', isSelected: false },
      ],
    },
    {
      part: 'Part B',
      section: 'Section 2',
      questionNo: 'Q2',
      subQuestionNo: '2b',
      obtainedMarks: '3',
      actualMarks: '5',
      error: [
        { errorId: 3, error: 'Error 3', isSelected: true },
        { errorId: 4, error: 'Error 4', isSelected: true },
      ],
    },
  ];

  it('renders the component with data', () => {
    render(
      <Provider store={store}>
        <MarksBreakupTable
          tableData={tableData}
          isEditMode={false}
        />
      </Provider>
    );

    expect(screen.getByText('PART')).toBeInTheDocument();
    expect(screen.getByText('SECTION')).toBeInTheDocument();
    expect(screen.getByText('MAIN QUESTION NO.')).toBeInTheDocument();
    expect(screen.getByText('QUESTION NO.')).toBeInTheDocument();
    expect(screen.getByText('MARKS')).toBeInTheDocument();
    expect(screen.getByText('ERROR')).toBeInTheDocument();

    expect(screen.getByText('Part A')).toBeInTheDocument();
    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('Q1')).toBeInTheDocument();
    expect(screen.getByText('1a')).toBeInTheDocument();

    expect(screen.getByText('Part B')).toBeInTheDocument();
    expect(screen.getByText('Section 2')).toBeInTheDocument();
    expect(screen.getByText('Q2')).toBeInTheDocument();
    expect(screen.getByText('2b')).toBeInTheDocument();
  });

  it('renders editable marks input in edit mode', () => {
    render(
      <Provider store={store}>
        <MarksBreakupTable
          tableData={tableData}
          isEditMode={true}
          handleChangeMarks={mockHandleChangeMarks}
        />
      </Provider>
    );

    const marksInputs = screen.getAllByRole('textbox');
    expect(marksInputs.length).toBe(2); 
    expect(marksInputs[0]).not.toBeDisabled();
    expect(marksInputs[1]).not.toBeDisabled();

    fireEvent.change(marksInputs[0], { target: { value: '7' } });
    expect(mockHandleChangeMarks).toHaveBeenCalledWith(expect.anything(), 0, tableData[0]);
  });

  it('renders tooltip with errors in view mode', () => {
    render(
      <Provider store={store}>
        <MarksBreakupTable
          tableData={tableData}
          isEditMode={false}
        />
      </Provider>
    );

    const tooltips = screen.getAllByText(/Error/);
    expect(tooltips[0]).toBeInTheDocument();
    expect(tooltips[1]).toBeInTheDocument();
  });

  it('does not render "Marks Breakup & Analytics" title when isReport is true', () => {
    render(
      <Provider store={store}>
        <MarksBreakupTable
          tableData={tableData}
          isEditMode={false}
          isReport={true}
        />
      </Provider>
    );

    const title = screen.queryByText('Marks Breakup & Analytics');
    expect(title).toBeNull();
  });

  it('renders "Marks Breakup & Analytics" title when isReport is false', () => {
    render(
      <Provider store={store}>
        <MarksBreakupTable
          tableData={tableData}
          isEditMode={false}
          isReport={false}
        />
      </Provider>
    );
  });

  it('handles multi-select change in edit mode', () => {
    render(
      <Provider store={store}>
        <MarksBreakupTable
          tableData={tableData}
          isEditMode={true}
          handleMultiSelectChange={mockHandleMultiSelectChange}
        />
      </Provider>
    );

    const selects = screen.getAllByRole('button');
    fireEvent.mouseDown(selects[0]);

    const options = screen.getAllByRole('option');
    fireEvent.click(options[1]);

    expect(mockHandleMultiSelectChange).toHaveBeenCalledWith(expect.anything(), 0, tableData[0]);
  });

  it('limits input to maximum allowed digits', () => {
    const data = [{ ...tableData[0], actualMarks: '100' }];
    render(
      <Provider store={store}>
        <MarksBreakupTable
          tableData={data}
          isEditMode={true}
          handleChangeMarks={mockHandleChangeMarks}
        />
      </Provider>
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '1000' } });
  });

  it('handles decimal input correctly', () => {
    render(
      <Provider store={store}>
        <MarksBreakupTable
          tableData={tableData}
          isEditMode={true}
          handleChangeMarks={mockHandleChangeMarks}
        />
      </Provider>
    );

    const input = screen.getAllByRole('textbox')[0];
    fireEvent.change(input, { target: { value: '7.55' } });
  });

});