import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../../redux/store";
import AssignTestContainer from "./AssignTestContainer";
import { assignStudentToPaper, getQuestionPaperList } from "../../../Api/OnlineAssements";

// Mock the API calls
jest.mock("../../../Api/OnlineAssements", () => ({
  assignStudentToPaper: jest.fn(),
  getQuestionPaperList: jest.fn(),
}));

describe("AssignTestContainer component", () => {
  const mockSelectedQuestion = {
    questionPaperSectionDetails: [
      { sectionID: 1, sectionName: "Section 1" },
      { sectionID: 2, sectionName: "Section 2" },
    ],
  };

  const mockHandleTestModalClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders AssignTestContainer component", () => {
    render(
      <Provider store={store}>
        <AssignTestContainer 
          selectedQuestion={mockSelectedQuestion}
          handleTestModalClose={mockHandleTestModalClose}                                                               
        /> 
      </Provider>
    );
    
    expect(screen.getByPlaceholderText("Search for Student")).toBeInTheDocument();
    expect(screen.getByText("Section")).toBeInTheDocument();
  });

  it("handles student search", async () => {
    render(
      <Provider store={store}>
        <AssignTestContainer 
          selectedQuestion={mockSelectedQuestion}
          handleTestModalClose={mockHandleTestModalClose}                                                               
        /> 
      </Provider>
    ); 

    const searchInput = screen.getByPlaceholderText("Search for Student");
    fireEvent.change(searchInput, { target: { value: 'John' } });

    await waitFor(() => {
      expect(searchInput).toHaveValue('John');
    }); 
  });

  it("handles section selection", async () => {
    render(
      <Provider store={store}>
        <AssignTestContainer 
          selectedQuestion={mockSelectedQuestion}
          handleTestModalClose={mockHandleTestModalClose}                                                               
        /> 
      </Provider>
    );

    const sectionDropdown = screen.getByText("Section");
    fireEvent.click(sectionDropdown);
  });

  it("handles select all checkbox", async () => {
    render(
      <Provider store={store}>
        <AssignTestContainer 
          selectedQuestion={mockSelectedQuestion}
          handleTestModalClose={mockHandleTestModalClose}                                                               
        /> 
      </Provider>
    );

    const selectAllCheckbox = screen.getByRole('checkbox', { name: '' });
    fireEvent.click(selectAllCheckbox);
  });

  it("handles individual student selection", async () => {
    render(
      <Provider store={store}>
        <AssignTestContainer 
          selectedQuestion={mockSelectedQuestion}
          handleTestModalClose={mockHandleTestModalClose}                                                               
        /> 
      </Provider>
    );

  });

  it("handles assigning students", async () => {
    (assignStudentToPaper as jest.Mock).mockResolvedValue({
      result: { responseCode: 0, responseDescription: 'success' }
    });
    (getQuestionPaperList as jest.Mock).mockResolvedValue({
      data: [], result: { responseDescription: 'Success' }
    });

    render(
      <Provider store={store}>
        <AssignTestContainer 
          selectedQuestion={mockSelectedQuestion}
          handleTestModalClose={mockHandleTestModalClose}                                                               
        /> 
      </Provider>
    );

    const assignButton = screen.getByText('Assign');
    
    await act(async () => {
      fireEvent.click(assignButton);
    });

    expect(assignStudentToPaper).toHaveBeenCalled();
    expect(getQuestionPaperList).toHaveBeenCalled();
    expect(mockHandleTestModalClose).toHaveBeenCalled();
  });

  it("handles error when assigning students", async () => {
    (assignStudentToPaper as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(
      <Provider store={store}>
        <AssignTestContainer 
          selectedQuestion={mockSelectedQuestion}
          handleTestModalClose={mockHandleTestModalClose}                                                               
        /> 
      </Provider>
    ); 

    const assignButton = screen.getByText('Assign');
    
    await act(async () => {
      fireEvent.click(assignButton);
    });

  });

  it("handles sorting", async () => {
    render(
      <Provider store={store}>
        <AssignTestContainer 
          selectedQuestion={mockSelectedQuestion}
          handleTestModalClose={mockHandleTestModalClose}                                                               
        /> 
      </Provider>
    );

    const nameSort = screen.getByText('NAME & CLASS');
    fireEvent.click(nameSort);

    const rollNumberSort = screen.getByText('ROLL NUMBER');
    fireEvent.click(rollNumberSort);
  });

});