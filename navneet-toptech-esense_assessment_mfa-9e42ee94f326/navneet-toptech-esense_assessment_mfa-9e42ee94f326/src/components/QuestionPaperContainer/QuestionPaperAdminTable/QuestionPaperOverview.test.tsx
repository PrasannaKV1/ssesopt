import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../../redux/store";
import QuestionOverview from "./QuestionPaperOverview";

const mockData = [
  {
    questionText: "What is the capital of France?",
    part: 1,
    section: 1,
    questionNo: 1,
    marks: 5,
    chapter: "Geography",
    difficulty: "Easy",
    marksAchieved: 4,
    errorAnalysis: "Minor errors",
    highestMarks: 5,
    lowestMarks: 2,
    totalMarks: 5,
    metaData: [
      { key: "Part", value: "Part 1", sequence: 1 },
      { key: "Section", value: "Section 1", sequence: 2 },
      { key: "Question", value: "Q1", sequence: 3 },
    ],
    noOfStudentAttempted: "10",
    totalScore: 40,
    totalStudents: 10,
    averageScore: 4,
    studentDetails: [
      { studentName: "John Doe", className: "10A" },
      { studentName: "Jane Doe", className: "10B" },
    ],
    chapterName: "Chapter 1",
    level: "Beginner",
  },
];

describe("QuestionPaper Overview component", () => {
  it("renders QuestionPaper Overview component", () => {
    render(
      <Provider store={store}>
        <QuestionOverview qpDetails={mockData} />
      </Provider>
    );
    expect(screen.getByText("Question and Answer Overview")).toBeInTheDocument();
  });

  it("toggles view details", async () => {
    render(
      <Provider store={store}>
        <QuestionOverview qpDetails={mockData} />
      </Provider>
    );

    const viewDetailsButton = screen.getByText("View Details");
    fireEvent.click(viewDetailsButton);

     waitFor(() => {
      expect(screen.getByText("Highest / Lowest")).toBeInTheDocument();
    });
  }); 
  
});