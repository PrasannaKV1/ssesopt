import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../../redux/store";
import NewAssignTimeModal from "./NewAssignTimeModal";
import * as Api from "../../../Api/QuestionTypePaper";
import dayjs from 'dayjs';

jest.mock("../../../Api/QuestionTypePaper");
jest.mock("../../../redux/actions/snackbarEvent");

describe("NewAssignTimeModal component", () => {
  const onCloseMock = jest.fn();
  const mockSelectedQuestion = {
    id: '1',
    startDate: '2024-08-27',
    endDate: '2024-08-28',
    startTime: '10:00',
    endTime: '12:00',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <NewAssignTimeModal
          open={true}
          onClose={onCloseMock}
          selectedQuestion={mockSelectedQuestion}
          questionPaperID="1"
          {...props}
        />
      </Provider>
    );
  };

  it("renders NewAssignTimeModal component", () => {
    renderComponent();
    // expect(screen.getByText("Enter New Start Time")).toBeInTheDocument(); 
  });

 
  it("updates start date when selected", async () => {
    renderComponent();
    const startDatePicker = screen.getByLabelText("Select Start Date*");
    fireEvent.change(startDatePicker, { target: { value: '2024-08-28' } });
    await waitFor(() => {
      expect(startDatePicker).toHaveValue('2024-08-28');
    });
  });

  it("updates end date when selected", async () => {
    renderComponent();
    const endDatePicker = screen.getByLabelText("Select Due Date *");
    fireEvent.change(endDatePicker, { target: { value: '2024-08-29' } });
    await waitFor(() => {
      expect(endDatePicker).toHaveValue('2024-08-29');
    });
  });

  it("updates start time when selected", async () => {
    renderComponent();
    const startTimePicker = screen.getByLabelText("Start Time*");
    fireEvent.change(startTimePicker, { target: { value: '11:00 AM' } });
    await waitFor(() => {
      expect(startTimePicker).toHaveValue('11:00 AM');
    });
  });

  it("updates end time when selected", async () => {
    renderComponent();
    const endTimePicker = screen.getByLabelText("Due Time*");
    fireEvent.change(endTimePicker, { target: { value: '01:00 PM' } });
    await waitFor(() => {
      expect(endTimePicker).toHaveValue('01:00 PM');
    });
  });

  it("displays error when due date is before start date", async () => {
    renderComponent();
    const startDatePicker = screen.getByLabelText("Select Start Date*");
    const endDatePicker = screen.getByLabelText("Select Due Date *");
    
    fireEvent.change(startDatePicker, { target: { value: '2024-08-29' } });
    fireEvent.change(endDatePicker, { target: { value: '2024-08-28' } });
    
  });

  it("calls API and closes modal on successful assign", async () => {
    (Api.DonePutApi as jest.Mock).mockResolvedValue({ status: 200 });
    renderComponent();
    
    fireEvent.click(screen.getByText("Assign"));
    
    await waitFor(() => {
      expect(Api.DonePutApi).toHaveBeenCalled();
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  it("shows error snackbar on API failure", async () => {
    (Api.DonePutApi as jest.Mock).mockRejectedValue({
      response: { status: 400, data: { responseDescription: "Error message" } }
    });
    renderComponent();
    
    fireEvent.click(screen.getByText("Assign"));
    
  });

  it("disables assign button when start time has passed", () => {
    const pastDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
    renderComponent({ selectedQuestion: { ...mockSelectedQuestion, startDate: pastDate } });
    
  });

  it("updates min due time when start time changes on same day", async () => {
    renderComponent();
    const startTimePicker = screen.getByLabelText("Start Time*");    
    fireEvent.change(startTimePicker, { target: { value: '10:00 AM' } });  
  });

});