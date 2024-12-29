import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../redux/store";
import StudentSheetInfo from "./StudentSheetInfo";
import { BrowserRouter as Router } from 'react-router-dom';

describe("StudentSheetInfo component", () => {
    const mockHandleDelete = jest.fn();
    const mockHandlePrevious = jest.fn();
    const mockHandleNext = jest.fn();
    
    const studentData = {
        answerSheets: [
            { type: 'jpg', url: 'test-url.jpg' },
            { type: 'pdf', url: 'test-url.pdf' },
        ]
    };

    it("renders component with default props", () => {
        render(
            <Provider store={store}>
                <Router>
                    <StudentSheetInfo />
                </Router>
            </Provider>
        );
        expect(screen.getByText("Uploaded Answer Sheet")).toBeInTheDocument();
    });

    it("renders component with editable props", () => {
        render(
            <Provider store={store}>
                <Router>
                    <StudentSheetInfo
                        isEditable={true}
                        handleDeleteSheet={mockHandleDelete}
                        handlePrevious={mockHandlePrevious}
                        handleNext={mockHandleNext}
                        currentIndex={0}
                        studentData={studentData}
                    />
                </Router>
            </Provider>
        );
    });

    it("renders image for jpg type answer sheet", () => {
        render(
            <Provider store={store}>
                <Router>
                    <StudentSheetInfo
                        isEditable={false}
                        handlePrevious={mockHandlePrevious}
                        handleNext={mockHandleNext}
                        currentIndex={0}
                        studentData={studentData}
                    />
                </Router>
            </Provider>
        );
        expect(screen.getByAltText("Answer Sheet")).toHaveAttribute('src', 'test-url.jpg');
    });

    it("renders PDF for pdf type answer sheet", () => {
        render(
            <Provider store={store}>
                <Router>
                    <StudentSheetInfo
                        isEditable={false}
                        handlePrevious={mockHandlePrevious}
                        handleNext={mockHandleNext}
                        currentIndex={1}
                        studentData={studentData}
                    />
                </Router>
            </Provider>
        );
    }); 

    it("toggles view state on button click", () => {
        render(
            <Provider store={store}>
                <Router>
                    <StudentSheetInfo
                        isEditable={false}
                        handlePrevious={mockHandlePrevious}
                        handleNext={mockHandleNext}
                        currentIndex={0}
                        studentData={studentData}
                    />
                </Router>
            </Provider>
        );
    }); 
    it("renders nothing if no answer sheets are available", () => {
        const noData = { answerSheets: [] }; // No answer sheets
    
        render(
            <Provider store={store}>
                <Router>
                    <StudentSheetInfo
                        isEditable={false}
                        handlePrevious={mockHandlePrevious}
                        handleNext={mockHandleNext}
                        currentIndex={0}
                        studentData={noData}
                    />
                </Router>
            </Provider>
        );
    
        expect(screen.queryByAltText("Answer Sheet")).not.toBeInTheDocument();
        expect(screen.queryByRole("img", { name: /prev/i })).not.toBeInTheDocument();
        expect(screen.queryByRole("img", { name: /next/i })).not.toBeInTheDocument();
    });
    
    it("renders nothing if answer sheet index is out of bounds", () => {
        render(
            <Provider store={store}>
                <Router>
                    <StudentSheetInfo
                        isEditable={false}
                        handlePrevious={mockHandlePrevious}
                        handleNext={mockHandleNext}
                        currentIndex={10} // Out of bounds index
                        studentData={studentData}
                    />
                </Router>
            </Provider> 
        );    
        expect(screen.queryByAltText("Answer Sheet")).not.toBeInTheDocument();
    });
    it("renders unsupported file type message", () => {
        const unsupportedData = {
            answerSheets: [
                { type: 'txt', url: 'test-url.txt' }, // Unsupported type
            ]
        };
    
        render(
            <Provider store={store}>
                <Router>
                    <StudentSheetInfo
                        isEditable={false}
                        handlePrevious={mockHandlePrevious}
                        handleNext={mockHandleNext}
                        currentIndex={0}
                        studentData={unsupportedData}
                    />
                </Router>
            </Provider>
        ); 
        expect(screen.getByText("Unsupported file type: txt")).toBeInTheDocument();
    });

}); 