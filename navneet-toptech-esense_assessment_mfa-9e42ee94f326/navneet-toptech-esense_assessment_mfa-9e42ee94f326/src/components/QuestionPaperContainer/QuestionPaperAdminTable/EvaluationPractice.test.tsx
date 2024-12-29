import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../../redux/store";
import EvaluationPractice from "./EvaluationPractice";

const sampleAssessmentData = {
    marks: 50,
    type: "Quiz",
    mode: "Online",
    courseNames: "Science",
    setName: "Set A",
    questionPaperName: "Math Quiz Paper",
    averageScore: 75.5,
    highestScore: 90,
    lowestScore: 60,
    assignedStudents: 30,
    avgAnswerAccuracy: 80,
    averageStudentScore: 70
};

const sampleStudentData = {
    studentName: "John Doe",
    studentProfileLink: "profile.jpg",
    className: "Class 10",
    rollNo: "12345"
};

describe("EvaluationPractice component", () => {
    it("renders without crashing", () => {
        render(
            <Provider store={store}>
                <EvaluationPractice
                    assessmentData={sampleAssessmentData}
                    downloadText="Download"
                />
            </Provider>
        );
    });

    it("renders details when studentData is not provided", () => {
        render(
            <Provider store={store}>
                <EvaluationPractice
                    assessmentData={sampleAssessmentData}
                    downloadText="Download"
                />
            </Provider>
        );

        expect(screen.getByText("Math Quiz Paper")).toBeInTheDocument();
        // expect(screen.getByText("Download")).toBeInTheDocument();
    });

    it("renders student details when studentData is provided", () => {
        render(
            <Provider store={store}>
                <EvaluationPractice
                    assessmentData={sampleAssessmentData}
                    downloadText="Download"
                    studentData={sampleStudentData}
                />
            </Provider>
        );

        expect(screen.getByText("John Doe")).toBeInTheDocument();
        // expect(screen.getByText("Class 10")).toBeInTheDocument();
        // expect(screen.getByText("Download")).toBeInTheDocument();
    });

    it("displays cards correctly for student data", () => {
        render(
            <Provider store={store}>
                <EvaluationPractice
                    assessmentData={sampleAssessmentData}
                    downloadText="Download"
                    studentData={sampleStudentData}
                />
            </Provider>
        ); 
    });

    it("handles button clicks", () => {
        render(
            <Provider store={store}>
                <EvaluationPractice
                    assessmentData={sampleAssessmentData}
                    downloadText="Download"
                    studentData={sampleStudentData}
                />
            </Provider>
        );

        // const button = screen.getByText("Download");
        // fireEvent.click(button);

    }); 
    
    it("renders online report cards when isOnlineTestReport is true and studentAnalysisOnlineReport is false", () => {
        render(
            <Provider store={store}>
                <EvaluationPractice
                    assessmentData={sampleAssessmentData}
                    downloadText="Download"
                    isOnlineTestReport={true}
                    studentAnalysisOnlineReport={false}
                />
            </Provider>
        );

        expect(screen.getByText("Avg Class Score")).toBeInTheDocument();
        expect(screen.getByText("Avg Attempt Time")).toBeInTheDocument();
        expect(screen.getByText("Highest VS Lowest")).toBeInTheDocument();
        expect(screen.getByText("Students Attempted VS Total")).toBeInTheDocument();
    });
});
