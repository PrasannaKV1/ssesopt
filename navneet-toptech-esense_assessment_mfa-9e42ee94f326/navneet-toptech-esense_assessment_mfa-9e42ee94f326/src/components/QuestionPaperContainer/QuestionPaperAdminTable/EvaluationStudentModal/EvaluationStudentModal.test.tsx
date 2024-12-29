import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../../../redux/store";
import StudentViewModal from "./EvaluationStudentModal"; 
import * as api from "../../../../Api/QuestionTypePaper";

jest.mock("../../../../Api/QuestionTypePaper");

describe("StudentViewModal component", () => {
    const mockStudentData = {
        questionPaperName: "Test Paper",
        marks: 100,
        paperType: "Type A",
        examMode: "Online",
        courseName: "Course 101",
        setId: 1,
        status: "Draft",
        totalQuestions: 10,
        answerSheets: [],
        // teacherRemarks: "Good job", 
        // obtainedMarks: 80,
        // totalMarks: 100, 
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders StudentViewModal component", () => {
        render(
            <Provider store={store}>
                <StudentViewModal
                    handelClosePopUp={jest.fn()}
                    studentData={mockStudentData}
                    selectedQuestion={{ id: 1 }}
                    allocationID={1}
                    setStudentData={jest.fn()}
                    setStudentModalOpen={jest.fn()}                   
                />
            </Provider>
        );

        expect(screen.getByText("Test Paper")).toBeInTheDocument();
    });

    it("handles edit button click", async () => {
        render(
            <Provider store={store}>
                <StudentViewModal 
                    handelClosePopUp={jest.fn()}
                    studentData={mockStudentData} 
                    selectedQuestion={{ id: 1 }}
                    allocationID={1}
                    setStudentData={jest.fn()}    
                    setStudentModalOpen={jest.fn()}                   
                
                />
            </Provider>
        );

        const editButton = screen.getByText(/Edit/i);
        fireEvent.click(editButton);

        expect(screen.getByText(/Save/i)).toBeInTheDocument();
    });

    it("handles publish button click", async () => {
        (api.publishMark as jest.Mock).mockResolvedValueOnce({ result: { responseDescription: "Success" } });
        (api.studentAssessmentByAllocationId as jest.Mock).mockResolvedValueOnce({ data: mockStudentData });

        render(
            <Provider store={store}>
                <StudentViewModal 
                    handelClosePopUp={jest.fn()}
                    studentData={mockStudentData} 
                    selectedQuestion={{ id: 1 }}
                    allocationID={1}
                    setStudentData={jest.fn()}  
                    setStudentModalOpen={jest.fn()}                                     
                />
            </Provider>
        );

        const publishButton = screen.getByText(/Publish/i);
        fireEvent.click(publishButton);

        waitFor(() => {
            expect(screen.getByText(/Students' marks published successfully/i)).toBeInTheDocument();
        });
    }); 

    it("handles unpublish button click", async () => {
        (api.publishMark as jest.Mock).mockResolvedValueOnce({ result: { responseDescription: "Success" } });
        (api.studentAssessmentByAllocationId as jest.Mock).mockResolvedValueOnce({ data: mockStudentData });

        render(
            <Provider store={store}>
                <StudentViewModal 
                    handelClosePopUp={jest.fn()}
                    studentData={mockStudentData} 
                    selectedQuestion={{ id: 1 }}
                    allocationID={1}
                    setStudentData={jest.fn()}  
                    setStudentModalOpen={jest.fn()}                                     
                />
            </Provider>
        );
    });

    it("handles delete sheet button click", () => {
        render(
            <Provider store={store}>
                <StudentViewModal 
                    handelClosePopUp={jest.fn()}
                    studentData={mockStudentData} 
                    selectedQuestion={{ id: 1 }}
                    allocationID={1}
                    setStudentData={jest.fn()}   
                    setStudentModalOpen={jest.fn()}                                    
                />
            </Provider>
        );

    });

    it("handles close modal", () => {
        const handleClose = jest.fn();
        render(
            <Provider store={store}>
                <StudentViewModal 
                    handelClosePopUp={handleClose}
                    studentData={mockStudentData} 
                    selectedQuestion={{ id: 1 }}
                    allocationID={1}
                    setStudentData={jest.fn()}   
                    setStudentModalOpen={jest.fn()}                                    
                />
            </Provider>
        );

        const cancelButton = screen.getByText(/Cancel/i);
        fireEvent.click(cancelButton);
        
        expect(handleClose).toHaveBeenCalled();
    });

    it("handles remarks change", () => {
        render(
            <Provider store={store}>
                <StudentViewModal 
                    handelClosePopUp={jest.fn()}
                    studentData={mockStudentData} 
                    selectedQuestion={{ id: 1 }}
                    allocationID={1}
                    setStudentData={jest.fn()}  
                    setStudentModalOpen={jest.fn()}                                     
                />
            </Provider>
        );

        const remarksInput = screen.getByRole('textbox');
        fireEvent.change(remarksInput, { target: { value: "Excellent work!" } });

    });

    it("handles change marks", async () => {
        render(
            <Provider store={store}>
                <StudentViewModal 
                    handelClosePopUp={jest.fn()}
                    studentData={mockStudentData} 
                    selectedQuestion={{ id: 1 }}
                    allocationID={1}
                    setStudentData={jest.fn()} 
                    setStudentModalOpen={jest.fn()}                   
                />
            </Provider>
        );
        expect(screen.getByText(/Total Questions:/i));          
    });
    it("handles publish button click - failure case", async () => {
        (api.publishMark as jest.Mock).mockRejectedValueOnce(new Error("Failed to publish marks"));
        
        render(
            <Provider store={store}>
                <StudentViewModal 
                    handelClosePopUp={jest.fn()}
                    studentData={mockStudentData} 
                    selectedQuestion={{ id: 1 }}
                    allocationID={1}
                    setStudentData={jest.fn()} 
                    setStudentModalOpen={jest.fn()}                   
                   
                />
            </Provider>
        );   
        const publishButton = screen.getByText(/Publish/i);
        fireEvent.click(publishButton);        
    }); 
     
            
});