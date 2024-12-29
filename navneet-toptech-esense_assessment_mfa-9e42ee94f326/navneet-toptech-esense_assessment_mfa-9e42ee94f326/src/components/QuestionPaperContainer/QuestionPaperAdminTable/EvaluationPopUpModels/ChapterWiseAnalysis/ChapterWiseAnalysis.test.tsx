import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../../../../redux/store";
import ChapterWiseAnalysis from "./ChapterWiseAnalysis";

describe("ChapterWiseAnalysis component", () => {
    const mockSubjectDetails = {
        percentage: 75,
        chapterName: "Chapter 1",
        topicWiseDetails: [
            { topicId: 1, topicName: "Topic 1", noOfQuestions: 10 },
            { topicId: 2, topicName: "Topic 2", noOfQuestions: 15 },
        ],
    };

    it("renders without crashing", () => {
        render(
            <Provider store={store}>
                <ChapterWiseAnalysis 
                 analysisName={""}
                 subjectDetails={undefined} />
            </Provider>
        );
    });

    it("renders with valid analysisName and subjectDetails", () => {
        render(
            <Provider store={store}>
                <ChapterWiseAnalysis
                 analysisName={"Test Analysis"} 
                 subjectDetails={mockSubjectDetails} />
            </Provider>
        );

        // expect(screen.getByText("Test Analysis")).toBeInTheDocument();
        expect(screen.getByText("Chapter 1")).toBeInTheDocument();
        expect(screen.getByText("Correct Answers")).toBeInTheDocument();
    });

    it("renders topics list when topicWiseDetails is not empty", () => {
        render(
            <Provider store={store}>
                <ChapterWiseAnalysis analysisName={"Test Analysis"} subjectDetails={mockSubjectDetails} />
            </Provider>
        );

        expect(screen.getByText("Topics Covered:")).toBeInTheDocument();
    });

    it("does not render topics list when topicWiseDetails is empty", () => {
        const mockSubjectDetailsEmptyTopics = {
            ...mockSubjectDetails,
            topicWiseDetails: [],
        };

        render(
            <Provider store={store}>
                <ChapterWiseAnalysis 
                 analysisName={"Test Analysis"}
                 subjectDetails={mockSubjectDetailsEmptyTopics} />
            </Provider>
        );
        expect(screen.queryByText("Topics Covered:")).not.toBeInTheDocument();
    });

});