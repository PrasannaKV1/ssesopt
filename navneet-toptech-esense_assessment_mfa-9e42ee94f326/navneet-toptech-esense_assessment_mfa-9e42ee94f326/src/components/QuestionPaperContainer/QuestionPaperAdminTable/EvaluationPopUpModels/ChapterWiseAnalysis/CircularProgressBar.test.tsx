import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../../../../redux/store";
import CircularProgressBar from "./CircularProgressBar";

describe("CircularProgressBar component", () => {
    it("renders CircularProgressBar component with topicWiseDetails", () => {
        const subjectDetails = {
            topicWiseDetails: [
                { topicId: 1, topicName: "Topic 1", noOfQuestions: 5 },
                { topicId: 2, topicName: "Topic 2", noOfQuestions: 3 },
            ]
        };
        
        render(
            <Provider store={store}>
                <CircularProgressBar
                    width={100}
                    height={100}
                    subjectDetails={subjectDetails}
                    isFlag={true}
                    heading="Test Heading"
                    strokeWidth={8}
                />
            </Provider>
        );

        expect(screen.getByText("Topics Covered:")).toBeInTheDocument();
        expect(screen.getByText("1. Topic 1 - 5 Q(s)")).toBeInTheDocument();
        expect(screen.getByText("2. Topic 2 - 3 Q(s)")).toBeInTheDocument();
    });

    it("does not render TopicsListBox when isFlag is false", () => {
        const subjectDetails = {
            topicWiseDetails: [
                { topicId: 1, topicName: "Topic 1", noOfQuestions: 5 },
            ]
        };

        render(
            <Provider store={store}>
                <CircularProgressBar
                    width={100}
                    height={100}
                    subjectDetails={subjectDetails}
                    isFlag={false}
                    heading="Test Heading"
                    strokeWidth={8}
                />
            </Provider>
        );

        expect(screen.queryByText("Topics Covered:")).not.toBeInTheDocument();
    });
}); 
