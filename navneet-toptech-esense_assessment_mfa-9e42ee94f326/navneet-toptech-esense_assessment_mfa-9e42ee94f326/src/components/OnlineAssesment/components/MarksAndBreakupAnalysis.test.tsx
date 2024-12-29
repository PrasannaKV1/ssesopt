import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../../redux/store";
import MarksAndBreakupAnalysis from "./MarksAndBreakupAnalysis";

// Mock data for testing
const mockTableData = [
    {
        sequenceNo: 1,
        questionText: "What is the capital of France?",
        questionImageDetails: [],
        obtainedMarks: 5,
        actualMarks: 10,
    },
    {
        sequenceNo: 2,
        questionText: "<img src='someimage.jpg' />{{imageKey}}",
        questionImageDetails: [
            { key: "imageKey", src: "imageSrc", tag: "ImageTag" }
        ],
        obtainedMarks: 7,
        actualMarks: 10,
    },
];

describe("MarksAndBreakupAnalysis component", () => {
    it("renders MarksAndBreakupAnalysis component without crashing", () => {
        render(
            <Provider store={store}>
                <MarksAndBreakupAnalysis reasonforLateSub="Reason for late submission" />
            </Provider>
        );
    }); 

    it("renders table headers correctly", () => {
        render(
            <Provider store={store}>
                <MarksAndBreakupAnalysis reasonforLateSub="Reason for late submission" />
            </Provider>
        );
        expect(screen.getByText("Question No")).toBeInTheDocument();
        expect(screen.getByText("Questions")).toBeInTheDocument();
        expect(screen.getByText("Marks")).toBeInTheDocument();
    });   

   

    it("renders reason for late submission correctly", () => {
        const reason = "Reason for late submission";
        render(
            <Provider store={store}>
                <MarksAndBreakupAnalysis tableData={mockTableData} reasonforLateSub={reason} />
            </Provider>
        );
    });

});