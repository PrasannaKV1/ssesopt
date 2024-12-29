import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../redux/store";
import MraksBreakUp from "./MraksBreakUp";

describe("MraksBreakUp component", () => {
    const mockHandleChangeMarks = jest.fn();
    const mockHandleMultiSelectChange = jest.fn();
    const mockHandleViewQuestionPaper = jest.fn();
    const mockHandleAnswerModal = jest.fn();

    const studentData = {
        studentName: "John",
        lastName: "Doe",
        className: "10th Grade",
        rollNo: "123",
        status: "Active",
        percentage: 85,
        obtainedMarks: 85,
        marks: 100,
        studentProfileImg: "profile.jpg"
    };

    const tableData = [
        { id: 1, name: "Math", marks: 90 },
        { id: 2, name: "Science", marks: 80 },
    ];

    it("renders without crashing", () => {
        render(
            <Provider store={store}>
                <MraksBreakUp
                    studentData={undefined}
                    isEditable={false}
                    remarks={""}
                    tableData={[]}
                />
            </Provider>
        );
    });

    it("renders with student data", () => {
        render(
            <Provider store={store}>
                <MraksBreakUp
                    studentData={studentData}
                    isEditable={false}
                    remarks={""}
                    tableData={[]}
                />
            </Provider>
        );
        expect(screen.getByText("John Doe")).toBeInTheDocument();
    }); 

    it("renders in editable mode", () => {
        render(
            <Provider store={store}>
                <MraksBreakUp
                    studentData={studentData}
                    isEditable={true}
                    remarks={""}
                    tableData={[]}
                />
            </Provider>
        );
        expect(screen.getByText("Percentage")).toBeInTheDocument();
        expect(screen.getByText("Marks Scored")).toBeInTheDocument();
    }); 

    it("renders in report mode", () => {
        render(
            <Provider store={store}>
                <MraksBreakUp
                    studentData={studentData}
                    isEditable={false}
                    remarks={""}
                    tableData={[]}
                    isReport={true}
                    handleViewQuestionPaper={mockHandleViewQuestionPaper}
                    handleAnswerModal={mockHandleAnswerModal}
                />
            </Provider>
        );
        expect(screen.getByText("Marks Breakup & Analytics")).toBeInTheDocument();
        fireEvent.click(screen.getByText("View Question Paper"));
        expect(mockHandleViewQuestionPaper).toHaveBeenCalled();
        fireEvent.click(screen.getByText("View Model Answer Paper"));
        expect(mockHandleAnswerModal).toHaveBeenCalled(); 
    });

    it("handles marks change", () => {
        render(
            <Provider store={store}>
                <MraksBreakUp
                    studentData={studentData}
                    isEditable={true}
                    remarks={""}
                    tableData={tableData}
                    handleChangeMarks={mockHandleChangeMarks}
                />
            </Provider>
        );
    });

    it("handles multi-select change", () => {
        render(
            <Provider store={store}>
                <MraksBreakUp
                    studentData={studentData}
                    isEditable={true}
                    remarks={""}
                    tableData={tableData}
                    handleMultiSelectChange={mockHandleMultiSelectChange}
                />
            </Provider>
        );
    });
    it("renders the published status with correct styles", () => {
        const publishedStudentData = {
            ...studentData,
            status: "Publish"
        };
    
        render(
            <Provider store={store}>
                <MraksBreakUp
                    studentData={publishedStudentData}
                    isEditable={false}
                    remarks={""}
                    tableData={[]}
                />
            </Provider>
        );
    
        const statusDiv = screen.getByText("Published").closest('.status-div');
        expect(statusDiv).toBeInTheDocument();
        expect(statusDiv).toHaveStyle('background: rgba(1, 181, 138, 0.1)');
    
        const statusText = screen.getByText("Published");
        expect(statusText).toHaveStyle('color: #01B58A');
    });
    
    it("renders the non-published status with default styles", () => {
        const activeStudentData = {
            ...studentData,
            status: "Active"
        };
    
        render(
            <Provider store={store}>
                <MraksBreakUp
                    studentData={activeStudentData}
                    isEditable={false}
                    remarks={""}
                    tableData={[]}
                />
            </Provider>
        );
    
        const statusDiv = screen.getByText("Active").closest('.status-div');
        expect(statusDiv).toBeInTheDocument();
        expect(statusDiv).not.toHaveStyle('background: rgba(1, 181, 138, 0.1)');
    
        const statusText = screen.getByText("Active");
        expect(statusText).not.toHaveStyle('color: #01B58A');
    });
    
    it("renders with no status and defaults to 'NA'", () => {
        const noStatusStudentData = {
            ...studentData,
            status: ""
        };
    
        render(
            <Provider store={store}>
                <MraksBreakUp
                    studentData={noStatusStudentData}
                    isEditable={false}
                    remarks={""}
                    tableData={[]}
                />
            </Provider>
        );
    
        const statusText = screen.getByText("NA");
        expect(statusText).toBeInTheDocument();
    }); 
    
});
