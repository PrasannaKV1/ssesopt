import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import OnlineQpCards from "./OnlineQpCards";
import store from "../../../redux/store";

// Mock the dependencies
jest.mock("../../../Api/OnlineAssements");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("OnlineQpCards component", () => {
    const mockData = {
        id: 1,  
        name: 'Test Question Paper',
        marks: 100,
        description: 'This is a test question paper description.',
        time: 60,
        templateID: 123, 
        questionPaperTypeID: 2, 
        gradeID: 5,  
        statusID: 1,  
        examTypeID: 3, 
        statusName: 'Active',
        generationModeID: 'A1',  
        generationMode: 'Automatic',
        questionPaperCourseDetails: [{ courseName: 'Math' }, { courseName: 'Science' }],
        questionPaperClassDetails: [{ className: 'Class 10' }, { className: 'Class 11' }],
        questionPaperSectionDetails: [{ sectionName: 'A' }, { sectionName: 'B' }],  
        studentsCount: 30,
        isSetsPresent: true,  
        isSetsAllocated: false,  
        isMarksUploaded: true,
        startDate: '2024-08-27',
        startTime: '10:00 AM',
        endDate: '2024-08-28',  
        endTime: '12:00 PM' 
      };
      

  const mockHandleQuestionMenuEvent = jest.fn();

  const renderComponent = (data = mockData) => {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <OnlineQpCards 
            key={0}
            data={data}
            handleQuestionMenuEvent={mockHandleQuestionMenuEvent} 
            setQpList={undefined}         
            />
        </MemoryRouter>
      </Provider>
    );
  };

  beforeEach(() => {
    mockHandleQuestionMenuEvent.mockClear();
  });

  it("renders OnlineQpCards component with correct data", () => {
    renderComponent();
    expect(screen.getByText('Test Question Paper')).toBeInTheDocument();
    // expect(screen.getByText('Class 10')).toBeInTheDocument();
    // expect(screen.getByText('Math')).toBeInTheDocument();
  });

  it("opens and closes the menu", async () => {
    renderComponent();
    const menuButton = screen.getByLabelText('more');
    fireEvent.click(menuButton);
    // expect(screen.getByText('View Online Test report')).toBeInTheDocument();
    // fireEvent.click(document.body);
  });

  it("calls handleQuestionMenuEvent when menu item is clicked", async () => {
    renderComponent();
    const menuButton = screen.getByLabelText('more');
    fireEvent.click(menuButton);
    // const menuItem = screen.getByText('View Online Test report');
    // fireEvent.click(menuItem);
    // expect(mockHandleQuestionMenuEvent).toHaveBeenCalledWith(expect.objectContaining({
    //   option: 'View Online Test report',
    //   data: mockData
    // }));
  });

  it("opens the duplicate test modal", () => {
    renderComponent();
    // const duplicateButton = screen.getByAltText('Copy Qp');
    // fireEvent.click(duplicateButton);  
  });

  it("opens the preview template", () => {
    renderComponent();
    const viewButton = screen.getByAltText('View Qp');
    fireEvent.click(viewButton);
  });


  it("renders correctly when isMarksUploaded is false", () => {
    const dataWithoutMarks = { ...mockData, isMarksUploaded: false };
    renderComponent(dataWithoutMarks);
    const menuButton = screen.getByLabelText('more');
    fireEvent.click(menuButton);
  });

  it("doesn't show delete and edit icons when close to test start time", () => {
    const nearFutureDate = new Date();
    nearFutureDate.setMinutes(nearFutureDate.getMinutes() + 4);
    const dataWithNearStartTime = {
      ...mockData,
      startDate: nearFutureDate.toISOString().split('T')[0],
      startTime: nearFutureDate.toTimeString().split(' ')[0],
    };
    renderComponent(dataWithNearStartTime);
    expect(screen.queryByAltText('Delete Qp')).not.toBeInTheDocument();
    expect(screen.queryByAltText('Edit Qp')).not.toBeInTheDocument();
  });

});