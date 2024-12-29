import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import OnlineStudentListTable from "./OnlineStudentListTable";
import store from "../../../redux/store";
import * as apiModule from "../../../Api/OnlineAssements";

jest.mock('../../../redux/actions/onlineAssement', () => ({
  Loader: jest.fn(),
  onlineAssementQpList: jest.fn(),
  onlineUpdateCurrentQpDetails: jest.fn(),
}));

jest.mock('../../../Api/OnlineAssements', () => ({
  assignChapterChallenge: jest.fn(),
  chapterChallenge: jest.fn(),
  markComplete: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe("OnlineStudentListTable component", () => {
  const mockQuestionPaper = {
    curriculumId: 1,
    chapterId: '1',
    name: 'Test Paper',
  };
  const mockStudentList = [
    { 
      allocationId: 1,
      studentId: 1001,
      studentName: 'John Doe', 
      rollNo: '001', 
      statusName: 'Submitted', 
      statusId: 6,
      className: '10A',
      studentProfileImg: 'profile.jpg'
    },
    { 
      allocationId: 2,
      studentId: 1002,
      studentName: 'Jane Smith', 
      rollNo: '002', 
      statusName: 'Pending', 
      statusId: 2,
      className: '10B',
      studentProfileImg: 'profile2.jpg'
    },
  ];

  beforeEach(() => {
    localStorage.setItem('state', JSON.stringify({
      currentAcademic: { acadamicId: '2023' },
      login: { userData: { userRefId: '123' } },
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("renders OnlineStudentListTable component with student data", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <OnlineStudentListTable 
            questionPaper={mockQuestionPaper} 
            data={mockStudentList}
            selectedOption="0"
          />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('STUDENTS')).toBeInTheDocument();
    expect(screen.getByText('ROLL NUMBER')).toBeInTheDocument();
    expect(screen.getByText('STATUS')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it("handles sorting when column headers are clicked", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <OnlineStudentListTable 
            questionPaper={mockQuestionPaper} 
            data={mockStudentList}
            selectedOption="0"
          />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText('STUDENTS'));
    fireEvent.click(screen.getByText('ROLL NUMBER'));
  });

  it("navigates to evaluation report for submitted tests", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <OnlineStudentListTable 
            questionPaper={mockQuestionPaper} 
            data={mockStudentList}
            selectedOption="0"
          />
        </MemoryRouter>
      </Provider>
    );

    const arrowButtons = screen.getAllByTestId('KeyboardArrowRightIcon');
    fireEvent.click(arrowButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith("/assess/evaluation/schoolReport", expect.any(Object));
  });

  it("shows error snackbar for non-submitted tests", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <OnlineStudentListTable 
            questionPaper={mockQuestionPaper} 
            data={mockStudentList}
            selectedOption="0"
          />
        </MemoryRouter>
      </Provider>
    );

    const arrowButtons = screen.getAllByTestId('KeyboardArrowRightIcon');
    fireEvent.click(arrowButtons[1]);

    expect(screen.getByText("View report is not possible as student has not yet submitted the Test.")).toBeInTheDocument();
  });

  it("handles mark complete checkbox", async () => {
    (apiModule.markComplete as jest.Mock).mockResolvedValue({ status: 200 });
    (apiModule.chapterChallenge as jest.Mock).mockResolvedValue({ result: { responseDescription: "Success" }, data: {} });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <OnlineStudentListTable 
            questionPaper={mockQuestionPaper} 
            data={mockStudentList}
            selectedOption="2"
            chapterNotCompleted={true}
            setChapterNotCompleted={jest.fn()}
            setChapterNotAssigned={jest.fn()}
            setQpList={jest.fn()}
            setSelectedQuestion={jest.fn()}
            chapterSearchFilter={{ classId: '10', subjectId: '1', gradeId: '10', sectionId: '1' }}
          />
        </MemoryRouter>
      </Provider>
    );

    const markCompleteButton = screen.getByText('Mark Chapter as Complete and Assign Chapter Challenge');
    fireEvent.click(markCompleteButton);

  });

  it("handles assign chapter", async () => {
    (apiModule.chapterChallenge as jest.Mock).mockResolvedValue({ result: { responseDescription: "Success" }, data: { paperId: '123' } });
    (apiModule.assignChapterChallenge as jest.Mock).mockResolvedValue({ result: { responseCode: 200, responseDescription: "Success" } });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <OnlineStudentListTable 
            questionPaper={mockQuestionPaper} 
            data={mockStudentList}
            selectedOption="2"
            chapterNotAssigned={true}
            setChapterNotAssigned={jest.fn()}
            setQpList={jest.fn()}
            setSelectedQuestion={jest.fn()}
            chapterSearchFilter={{ subjectId: '1', gradeId: '10', sectionId: '1' }}
          />
        </MemoryRouter>
      </Provider>
    );

    const assignButton = screen.getByText('Assign this chapter challenge');
    fireEvent.click(assignButton);
  });

  it("renders empty state when no data is provided", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <OnlineStudentListTable 
            questionPaper={mockQuestionPaper} 
            data={[]}
            selectedOption="0"
          />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('No match found!')).toBeInTheDocument();
  });

  it("handles pagination", () => {
    const manyStudents = Array(15).fill(null).map((_, index) => ({
      allocationId: 2,
      studentId: 1002,
      studentName: `Student ${index}`,
      rollNo: `00${index}`,
      statusName: 'Pending',
      statusId: 2,
      className: '10A',
      studentProfileImg: 'profile.jpg'
    }));

    render(
      <Provider store={store}>
        <MemoryRouter>
          <OnlineStudentListTable 
            questionPaper={mockQuestionPaper} 
            data={manyStudents}
            selectedOption="0"
          />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Student 0')).toBeInTheDocument();
    expect(screen.queryByText('Student 14')).not.toBeInTheDocument();

    const nextPageButton = screen.getByLabelText('Go to page 2');
    fireEvent.click(nextPageButton);

    expect(screen.queryByText('Student 0')).not.toBeInTheDocument();
    expect(screen.getByText('Student 14')).toBeInTheDocument();
  });

});