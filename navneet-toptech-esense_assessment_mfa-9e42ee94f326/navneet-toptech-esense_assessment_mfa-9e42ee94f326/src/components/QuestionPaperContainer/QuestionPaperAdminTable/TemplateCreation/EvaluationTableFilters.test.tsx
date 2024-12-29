import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../../../redux/store";
import EvaluationTableFilters from "./EvaluationTableFilters"; 

describe('EvaluationTableFilters', () => {
    const mockStudentList = [
        {
            marks: null,
            studentId: 1,
            firstName: "John",
            lastName: "Doe",
            rollNumber: "123",
            className: "10A",
            courseId: 101,
            classId: 10,
            photo: null,
            section: "A",
            sectionId: "1",
            isAnswerSheetUploaded: false, 
        } 
    ];
    it("renders Evaluation Table Filters", () => {
        render(
            <Provider store={store}>
                <EvaluationTableFilters 
                    handleStudentNameSearch={jest.fn()} 
                    studentList={[]} 
                    handleSectionFilter={jest.fn()} 
                    selectedQuestion={undefined} />
            </Provider>
        );
    });

    it("renders EvaluationTableFilters with default props", () => {
        render(
            <Provider store={store}>
                <EvaluationTableFilters 
                    handleStudentNameSearch={jest.fn()} 
                    studentList={[]} 
                    handleSectionFilter={jest.fn()} 
                    selectedQuestion={undefined} />
            </Provider>
        );
    
        expect(screen.getByPlaceholderText("Search for Student")).toBeInTheDocument();
        expect(screen.getByLabelText("Section")).toBeInTheDocument();
        expect(screen.getByText("Bulk Upload Marks")).toBeInTheDocument();
    });

    it("calls handleStudentNameSearch on TextField input change", () => {
        const handleStudentNameSearch = jest.fn();
    
        render(
            <Provider store={store}>
                <EvaluationTableFilters 
                    handleStudentNameSearch={handleStudentNameSearch} 
                    studentList={[]} 
                    handleSectionFilter={jest.fn()} 
                    selectedQuestion={undefined} />
            </Provider>
        );
    
        fireEvent.change(screen.getByPlaceholderText("Search for Student"), { target: { value: "John Doe" } });
        expect(handleStudentNameSearch).toHaveBeenCalledWith("John Doe");
    });
    it("renders Select options based on sectionType", () => {
        render(
            <Provider store={store}> 
                <EvaluationTableFilters 
                    handleStudentNameSearch={jest.fn()} 
                    studentList={[]} 
                    handleSectionFilter={jest.fn()} 
                    selectedQuestion={{
                        questionPaperSectionDetails: [
                            { sectionID: 1, sectionName: "Math" },
                            { sectionID: 2, sectionName: "Science" }
                        ]
                    }} 
                />
            </Provider>
        );
    });
    it("opens and closes FileUploadPopup correctly", () => {
        render(
            <Provider store={store}>
                <EvaluationTableFilters 
                    handleStudentNameSearch={jest.fn()} 
                    studentList={mockStudentList} 
                    
                    handleSectionFilter={jest.fn()} 
                    selectedQuestion={{ id: 1, name: "Test Question" }}
                    bulkUploadMainBtn={false}
                />
            </Provider>
        ); 

        fireEvent.click(screen.getByText("Bulk Upload Marks"));
        expect(screen.getByText("Upload Student Marks In Bulk")).toBeInTheDocument();
    });
});
