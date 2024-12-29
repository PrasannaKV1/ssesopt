import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../../../redux/store";
import EvaluationTable from "./EvaluationTable";

describe("Evaluation Listing Table", () => {

    beforeEach(() => jest.clearAllMocks());
    const mockData = [
        {
            section: "A",
            marks: { math: 90, science: 85, english: 88 },
            sectionId: 1,
            studentId: 1001,
            firstName: "John",
            lastName: "Doe",
            rollNumber: "123",
            className: "10th Grade",
            courseIds: [101, 102, 103],
            classId: 10,
            allocationId: 201,
            middleName: "William",
            studentProfileImg: "path/to/profile1.jpg",
            isAnswerSheetUploaded: true,
            isMarksUploaded: true,
            obtainedMarks: 263,
            totalMarks: 300,
            isMarksPublish: true,
            status: "active"
        },
        {
            section: "B",
            marks: { math: 80, science: 75, english: 78 },
            sectionId: 2,
            studentId: 1002,
            firstName: "Jane",
            lastName: "Smith",
            rollNumber: "B002",
            className: "10th Grade",
            courseIds: [101, 102, 104],
            classId: 10,
            allocationId: 202,
            studentProfileImg: "path/to/profile2.jpg",
            isAnswerSheetUploaded: false,
            isMarksUploaded: false,
            obtainedMarks: 233,
            totalMarks: 300,
            isMarksPublish: false,
            status: "inactive"
        },
    ];
    const mockSelectedQuestion = {
        id: 1,
        isMarksUploaded: false,
        isMarksAddedForAll: false,
    };

    it("renders evaluation listing table", async () => {
        render(
            <Provider store={store}>
                <EvaluationTable
                    data={[]}
                    selectedQuestion={jest.fn()}
                    setBulkUploadMainBtn={jest.fn()}
                    bulkUploadMainBtn={false} 
                    setPage={jest.fn()} 
                    page={1}/>
            </Provider>
        )
    });

    it("renders evaluation listing table with mock data", async () => {
        render(
            <Provider store={store}>
                <EvaluationTable
                    data={mockData}
                    selectedQuestion={jest.fn()}
                    setBulkUploadMainBtn={jest.fn()}
                    bulkUploadMainBtn={false} 
                    setPage={jest.fn()}
                    page={1}
                    />
            </Provider>
        )
        expect(screen.getByText('STUDENTS')).toBeInTheDocument();
        expect(screen.getByText('ROLL NUMBER')).toBeInTheDocument();
        expect(screen.getByText('MARKS')).toBeInTheDocument();
        expect(screen.getByText('STATUS')).toBeInTheDocument();
    });

    it('renders student data correctly', () => {
        render(
            <Provider store={store}>
                <EvaluationTable data={mockData} selectedQuestion={{}} setBulkUploadMainBtn={jest.fn()} bulkUploadMainBtn={false} setPage={jest.fn()} page={1} />
            </Provider>
        );
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('123')).toBeInTheDocument();
    });

    it('renders student data correctly', () => {
        render(
            <Provider store={store}>
                <EvaluationTable
                    data={mockData}
                    selectedQuestion={mockSelectedQuestion}
                    setBulkUploadMainBtn={jest.fn()}
                    bulkUploadMainBtn={false}
                    setPage={jest.fn()}
                    page={1} />
            </Provider>
        );
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('123')).toBeInTheDocument();
    });

    // it('selects all students when select all checkbox is checked', () => {
    //     render(
    //         <Provider store={store}>
    //             <EvaluationTable
    //                 data={mockData}
    //                 selectedQuestion={mockSelectedQuestion}
    //                 setBulkUploadMainBtn={jest.fn()}
    //                 bulkUploadMainBtn={false} />
    //         </Provider>
    //     );

    //     const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all/i });
    //     fireEvent.click(selectAllCheckbox);

    //     mockData.forEach(student => {
    //         expect(screen.getByRole('checkbox', { name: new RegExp(student.rollNumber, 'i') })).toBeChecked();
    //     });
    // });

    it('sorts students by firstName', () => {
        render(
            <Provider store={store}>
                <EvaluationTable
                    data={mockData}
                    selectedQuestion={mockSelectedQuestion}
                    setBulkUploadMainBtn={jest.fn()}
                    bulkUploadMainBtn={false} 
                    setPage={jest.fn()}
                    page={1}
                    />
            </Provider>
        );

        const firstNameHeader = screen.getByText('STUDENTS');
        fireEvent.click(firstNameHeader);

    });

    it('opens upload marks modal', () => {
        render(
            <Provider store={store}>
                <EvaluationTable
                    data={mockData}
                    selectedQuestion={mockSelectedQuestion}
                    setBulkUploadMainBtn={jest.fn()}
                    bulkUploadMainBtn={false} 
                    setPage={jest.fn()}
                    page={1}
                    />
            </Provider>
        );

        const uploadMarksButton = screen.getByText('Upload Marks');
        fireEvent.click(uploadMarksButton);
        const uploadMarksSheet= screen.getByText('Upload Sheet');
        fireEvent.click(uploadMarksSheet); 
        const ReuploadMarksButton = screen.getByText('Re-Upload Marks');
        fireEvent.click(ReuploadMarksButton);
        


    });

    it('opens bulk upload modal', () => {
        render(
            <Provider store={store}>
                <EvaluationTable
                    data={mockData}
                    selectedQuestion={mockSelectedQuestion}
                    setBulkUploadMainBtn={jest.fn()}
                    bulkUploadMainBtn={true} 
                    setPage={jest.fn()}
                    page={1}
                    />
            </Provider>
        );

        // const bulkUploadButton = screen.getByText(/Bulk Upload Marks/i);
        // fireEvent.click(bulkUploadButton);

    });

    it('paginates student list', () => {
        render(
            <Provider store={store}>
                <EvaluationTable
                    data={mockData}
                    selectedQuestion={mockSelectedQuestion}
                    setBulkUploadMainBtn={jest.fn()}
                    bulkUploadMainBtn={false} 
                    setPage={jest.fn()}
                    page={1}
                    />
            </Provider>
        );

        // const paginationButton = screen.getByRole('button', { name: /2/i });
        // fireEvent.click(paginationButton);

    }); 
    
}); 
