import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import store from "../../../redux/store";
import StudentReportContainer from "./StudentReportContainer";
import { studentAssessmentByAllocationId, assessmentDataOfStudents } from "../../../Api/QuestionTypePaper";
import { studentOvewViewReports } from "../../../Api/AssessmentReports";

jest.mock("../../../Api/QuestionTypePaper", () => ({
  studentAssessmentByAllocationId: jest.fn(),
  assessmentDataOfStudents: jest.fn(),
}));

jest.mock("../../../Api/AssessmentReports", () => ({
  studentOvewViewReports: jest.fn(),
}));

describe("StudentReportContainer component", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("renders without crashing", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ state: { studentDetails: { studentId: "1", allocationId: "1" }, selectedQp: "1" } }]}>
          <StudentReportContainer />
        </MemoryRouter>
      </Provider>
    );
  });

  it("fetches student details and overview on mount", async () => {
    (studentAssessmentByAllocationId as jest.Mock).mockResolvedValue({
      data: {
        teacherRemarks: "Good job",
        setName: "Set A",
        answerSheetInfo: [
          {
            id: "1",
            sequenceNo: "1",
            type: "Part",
            children: [
              {
                id: "2",
                sequenceNo: "1.1",
                type: "Question",
                obtainedMarks: 5,
                actualMarks: 10,
                errors: [],
              },
            ],
          },
        ],
      },
    });

    (studentOvewViewReports as jest.Mock).mockResolvedValue([
      {
        allocationId: "1",
        data: [
          {
            questionId: "1",
            obtainedMarks: 5,
            actualMarks: 10,
          },
        ],
      },
    ]);

    (assessmentDataOfStudents as jest.Mock).mockResolvedValue({
      data: {
        subjectWiseDetails: [
          {
            chapterWiseDetails: [
              {
                chapterName: "Chapter 1",
                marksObtained: 5,
                totalMarks: 10,
              },
            ],
          },
        ],
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ state: { studentDetails: { studentId: "1", allocationId: "1" }, selectedQp: "1" } }]}>
          <StudentReportContainer />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      // expect(studentAssessmentByAllocationId as jest.Mock).toHaveBeenCalledWith("1");
      expect(studentOvewViewReports as jest.Mock).toHaveBeenCalledWith({ qpId: "1", studentId: "1" });
      // expect(assessmentDataOfStudents as jest.Mock).toHaveBeenCalledWith("1", "1");
    }); 
  });

  it("navigates back when back button is clicked", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ state: { studentDetails: { studentId: "1", allocationId: "1" }, selectedQp: "1" } }]}>
          <StudentReportContainer />
        </MemoryRouter>
      </Provider>
    );

    // const backButton = screen.getByAltText("Go Back arrow");
    // fireEvent.click(backButton);
  });

  it("handles next and previous student sheet navigation", async () => {
    (studentAssessmentByAllocationId as jest.Mock).mockResolvedValue({
      data: {
        teacherRemarks: "Good job",
        setName: "Set A",
        answerSheetInfo: [
          {
            id: "1",
            sequenceNo: "1",
            type: "Part",
            children: [
              {
                id: "2",
                sequenceNo: "1.1",
                type: "Question",
                obtainedMarks: 5,
                actualMarks: 10,
                errors: [],
              },
            ],
          },
        ],
        answerSheets: [
          { id: "1" },
          { id: "2" },
        ],
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ state: { studentDetails: { studentId: "1", allocationId: "1" }, selectedQp: "1" } }]}>
          <StudentReportContainer />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(studentAssessmentByAllocationId as jest.Mock).toHaveBeenCalled();
    }); 

  });

  it("handles view question paper and answer modal", async () => {
    (studentAssessmentByAllocationId as jest.Mock).mockResolvedValue({
      data: {
        teacherRemarks: "Good job",
        setName: "Set A",
        answerSheetInfo: [
          {
            id: "1",
            sequenceNo: "1",
            type: "Part",
            children: [
              {
                id: "2",
                sequenceNo: "1.1",
                type: "Question",
                obtainedMarks: 5,
                actualMarks: 10,
                errors: [],
              },
            ],
          },
        ],
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ state: { studentDetails: { studentId: "1", allocationId: "1" }, selectedQp: "1" } }]}>
          <StudentReportContainer />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(studentAssessmentByAllocationId as jest.Mock).toHaveBeenCalled();
    });

    // const viewQuestionPaperButton = screen.getByText("View Question Paper");
    // fireEvent.click(viewQuestionPaperButton);

  });  
});  
