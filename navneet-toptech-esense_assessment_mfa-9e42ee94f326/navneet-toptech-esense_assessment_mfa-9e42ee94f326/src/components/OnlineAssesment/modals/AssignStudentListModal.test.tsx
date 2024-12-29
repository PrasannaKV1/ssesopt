import { fireEvent, render, screen, waitFor, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import AssignStudentListModal from "./AssignStudentListModal";
import * as api from "../../../Api/OnlineAssements";
import { SnackbarEventActions } from "../../../redux/actions/snackbarEvent";
import store from "../../../redux/store";

jest.mock("../../../Api/OnlineAssements");
jest.mock("../../../redux/actions/snackbarEvent");


describe("AssignStudentListModal component", () => {
    const mockHandleClose = jest.fn();
    const mockHandleStudentModalClose = jest.fn();

    const mockStudentList = [
        { studentId: 1, firstName: "John", lastName: "Doe", rollNumber: "001", className: "Class A", sectionId: "1" },
        { studentId: 2, firstName: "Jane", lastName: "Smith", rollNumber: "002", className: "Class B", sectionId: "2" }
    ];

    const mockSelectedQuestion = {
        gradeID: 1,
        sections: [
            { sectionID: "1", sectionName: "Section A" },
            { sectionID: "2", sectionName: "Section B" }
        ]
    }; 

    it("renders AssignStudentListModal component", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <AssignStudentListModal 
                        studentList={mockStudentList}
                        selectedQuestion={mockSelectedQuestion}
                        studentListModal={true}
                        handleClose={mockHandleClose}
                        handleStudentModalCLose={mockHandleStudentModalClose}
                        questionPaperID={1}
                    />
                </MemoryRouter>
            </Provider>
        );
        expect(screen.getByText("Assign Question Paper to Students")).toBeInTheDocument();
    });

    it("handles search functionality", async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <AssignStudentListModal 
                        studentList={mockStudentList}
                        selectedQuestion={mockSelectedQuestion}
                        studentListModal={true}
                        handleClose={mockHandleClose}
                        handleStudentModalCLose={mockHandleStudentModalClose}
                        questionPaperID={1}
                    />
                </MemoryRouter>
            </Provider>
        );

        const searchInput = screen.getByPlaceholderText("Search for Student");
        fireEvent.change(searchInput, { target: { value: 'John' } });

        await waitFor(() => {
            expect(screen.getByText("John Doe")).toBeInTheDocument();
            expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
        });
    });

    it("handles section filter", async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <AssignStudentListModal 
                        studentList={mockStudentList}
                        selectedQuestion={mockSelectedQuestion}
                        studentListModal={true}
                        handleClose={mockHandleClose}
                        handleStudentModalCLose={mockHandleStudentModalClose}
                        questionPaperID={1}
                    />
                </MemoryRouter>
            </Provider>
        );

        const sectionDropdown = screen.getByText("Section");
        fireEvent.click(sectionDropdown);
        
    });

    it("handles sorting", async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <AssignStudentListModal 
                        studentList={mockStudentList}
                        selectedQuestion={mockSelectedQuestion}
                        studentListModal={true}
                        handleClose={mockHandleClose}
                        handleStudentModalCLose={mockHandleStudentModalClose}
                        questionPaperID={1}
                    />
                </MemoryRouter>
            </Provider>
        );
        const nameSortButton = screen.getByText("NAME & CLASS");
        fireEvent.click(nameSortButton);
    });

    it("handles checkbox selection", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <AssignStudentListModal 
                        studentList={mockStudentList}
                        selectedQuestion={mockSelectedQuestion}
                        studentListModal={true}
                        handleClose={mockHandleClose}
                        handleStudentModalCLose={mockHandleStudentModalClose}
                        questionPaperID={1}
                    />
                </MemoryRouter>
            </Provider>
        );

        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[1]);

        expect(checkboxes[1]).toBeChecked();
        expect(checkboxes[2]).not.toBeChecked();

        fireEvent.click(checkboxes[0]);

        expect(checkboxes[0]).toBeChecked();
        expect(checkboxes[1]).toBeChecked();
        expect(checkboxes[2]).toBeChecked();
    });

    it("handles assign button click", async () => {
        (api.assignStudentToPaper as jest.Mock).mockResolvedValue({
            result: { responseCode: 0, responseDescription: 'success' }
        });
        (api.getQuestionPaperList as jest.Mock).mockResolvedValue({
            data: [], result: { responseDescription: "Success" }
        });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <AssignStudentListModal 
                        studentList={mockStudentList}
                        selectedQuestion={mockSelectedQuestion}
                        studentListModal={true}
                        handleClose={mockHandleClose}
                        handleStudentModalCLose={mockHandleStudentModalClose}
                        questionPaperID={1}
                    />
                </MemoryRouter>
            </Provider>
        );

        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[1]);

        const assignButton = screen.getByText("Assign");
        fireEvent.click(assignButton);
    });

    it("handles assign button click with error", async () => {
        (api.assignStudentToPaper as jest.Mock).mockResolvedValue({
            response: { status: 400, data: { responseDescription: "Error occurred" } }
        });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <AssignStudentListModal 
                        studentList={mockStudentList}
                        selectedQuestion={mockSelectedQuestion}
                        studentListModal={true}
                        handleClose={mockHandleClose}
                        handleStudentModalCLose={mockHandleStudentModalClose}
                        questionPaperID={1}
                    />
                </MemoryRouter>
            </Provider>
        );

        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[1]); 

        const assignButton = screen.getByText("Assign");
        fireEvent.click(assignButton);

        await waitFor(() => {
            expect(api.assignStudentToPaper).toHaveBeenCalled();
            expect(SnackbarEventActions).toHaveBeenCalledWith({
                snackbarOpen: true,
                snackbarType: "error",
                snackbarMessage: "Error occurred",
            });
        });
    });

    it("closes modal when cancel button is clicked", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <AssignStudentListModal 
                        studentList={mockStudentList}
                        selectedQuestion={mockSelectedQuestion}
                        studentListModal={true}
                        handleClose={mockHandleClose}
                        handleStudentModalCLose={mockHandleStudentModalClose}
                        questionPaperID={1}
                    />
                </MemoryRouter>
            </Provider>
        );

        const cancelButton = screen.getByText("Cancel");
        fireEvent.click(cancelButton);
        expect(mockHandleStudentModalClose).toHaveBeenCalled();
    });

}); 