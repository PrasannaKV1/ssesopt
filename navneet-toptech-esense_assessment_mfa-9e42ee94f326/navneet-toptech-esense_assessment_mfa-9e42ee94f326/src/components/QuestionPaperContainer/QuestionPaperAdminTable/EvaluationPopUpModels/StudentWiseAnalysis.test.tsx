import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from 'react-router-dom';
import store from "../../../../redux/store";
import StudentWiseAnalysis from "./StudentWiseAnalysis";
import { studentWiseReport } from "../../../../Api/QuestionTypePaper";

jest.mock('../../../../Api/QuestionTypePaper', () => ({
    studentWiseReport: jest.fn(),
})); 

const mockResponse = { 
    baseResponse: {
        result: {
            responseDescription: 'success',
        },
        data: [
            {
                studentProfileLink: "profileLink",
                studentId: 1,
                allocationId: 101,
                studentName: "John Doe",
                className: "Grade 5 - A",
                rollNo: "001",
                totalMarks: 85,
                answerAccuracy: 90,
            },
            {
                studentProfileLink: "profileLink2",
                studentId: 2,
                allocationId: 102,
                studentName: "Jane Smith",
                className: "Grade 5 - B",
                rollNo: "002",
                totalMarks: 75,
                answerAccuracy: 80,
            },
        ],
        totalPages: 1,
    }
};

const mockOnlineTestResponse = {
    baseResponse: {
        result: {
            responseDescription: 'success',
        },
        data: [
            {
                studentProfileLink: "profileLink",
                studentId: 1,
                allocationId: 101,
                studentName: "John Doe",
                className: "Grade 5 - A",
                rollNo: "001",
                totalMarks: 85,
                correctAnswers: 17,
                incorrectAnswers: 3,
                skippedQuestions: 2,
            },
        ],
        totalPages: 1,
    }
};

describe("StudentWiseAnalysis component", () => {
    beforeEach(() => {
        (studentWiseReport as jest.Mock).mockResolvedValue(mockResponse);
    });

    it("renders StudentWiseAnalysis component", async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <StudentWiseAnalysis questionId={123} />
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Student-wise Analysis/i)).toBeInTheDocument();
        });
    });

    it("toggles view details", async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <StudentWiseAnalysis questionId={123} />
                </MemoryRouter>
            </Provider>
        );

        const viewDetailsToggle = screen.getByText(/View Details/i);
        fireEvent.click(viewDetailsToggle);
        expect(screen.getByText(/Name & Class/i)).toBeInTheDocument();
    });

    it("sorts by student name", async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <StudentWiseAnalysis questionId={123} />
                </MemoryRouter>
            </Provider>
        );

        const viewDetailsToggle = screen.getByText(/View Details/i);
        fireEvent.click(viewDetailsToggle);

        const sortNameButton = screen.getAllByRole('button')[1]; 
        fireEvent.click(sortNameButton);

    });

    it("sorts by roll number", async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <StudentWiseAnalysis questionId={123} />
                </MemoryRouter>
            </Provider>
        );

        const viewDetailsToggle = screen.getByText(/View Details/i);
        fireEvent.click(viewDetailsToggle);

        const sortRollNoButton = screen.getAllByRole('button')[3];
        fireEvent.click(sortRollNoButton);
    });

    it("navigates to student details view", async () => {
        const mockNavigate = jest.fn();
        jest.mock('react-router', () => ({
            ...jest.requireActual('react-router'),
            useNavigate: () => mockNavigate,
        })); 

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <StudentWiseAnalysis questionId={123} />
                </MemoryRouter>
            </Provider>
        );

        const viewDetailsToggle = screen.getByText(/View Details/i);
        fireEvent.click(viewDetailsToggle);
    });

    it("handles no data scenario", async () => {
        (studentWiseReport as jest.Mock).mockResolvedValue({
            baseResponse: {
                result: {
                    responseDescription: 'success',
                },
                data: [],
                totalPages: 0,
            }
        });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <StudentWiseAnalysis questionId={123} />
                </MemoryRouter>
            </Provider>
        );

        const viewDetailsToggle = screen.getByText(/View Details/i);
        fireEvent.click(viewDetailsToggle);

        expect(screen.queryByText(/John Doe/i)).not.toBeInTheDocument();
    });

    it("renders student data in table rows", async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <StudentWiseAnalysis questionId={123} />
                </MemoryRouter>
            </Provider>
        );

        const viewDetailsToggle = screen.getByText(/View Details/i);
        fireEvent.click(viewDetailsToggle);

        expect(await screen.findByText(/John Doe/i)).toBeInTheDocument();
        expect(await screen.findByText(/001/i)).toBeInTheDocument();
        expect(await screen.findByText(/85/i)).toBeInTheDocument();
        expect(await screen.findByText(/90/i)).toBeInTheDocument();
    });

    it("renders online test report data correctly", async () => {
        (studentWiseReport as jest.Mock).mockResolvedValue(mockOnlineTestResponse);

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <StudentWiseAnalysis questionId={123} isOnlineTestReport={true} />
                </MemoryRouter>
            </Provider>
        );

        const viewDetailsToggle = screen.getByText(/View Details/i);
        fireEvent.click(viewDetailsToggle);

        expect(await screen.findByText(/INCORRECT ANSWERS/i)).toBeInTheDocument();
        expect(await screen.findByText(/SKIPPED QUESTIONS/i)).toBeInTheDocument();
        expect(await screen.findByText(/17/i)).toBeInTheDocument(); 
        expect(await screen.findByText(/3/i)).toBeInTheDocument(); 
        expect(await screen.findByText(/2/i)).toBeInTheDocument(); 
    });

    it("handles pagination", async () => {
        const manyStudents = Array(15).fill(null).map((_, index) => ({
            ...mockResponse.baseResponse.data[0],
            studentId: index + 1,
            studentName: `Student ${index + 1}`,
            rollNo: `00${index + 1}`,
        }));

        (studentWiseReport as jest.Mock).mockResolvedValue({
            ...mockResponse,
            baseResponse: {
                ...mockResponse.baseResponse,
                data: manyStudents,
                totalPages: 3,
            }
        });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <StudentWiseAnalysis questionId={123} />
                </MemoryRouter>
            </Provider>
        );

        const viewDetailsToggle = screen.getByText(/View Details/i);
        fireEvent.click(viewDetailsToggle);

        // Check first page
        expect(await screen.findByText(/Student 1/i)).toBeInTheDocument();
        expect(screen.queryByText(/Student 6/i)).not.toBeInTheDocument();

        // Go to next page
        const nextPageButton = screen.getByRole('button', { name: /Go to page 2/i });
        fireEvent.click(nextPageButton);

    });

    it("handles API error", async () => {
        (studentWiseReport as jest.Mock).mockRejectedValue(new Error("API Error"));

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <StudentWiseAnalysis questionId={123} />
                </MemoryRouter>
            </Provider>
        );

        const viewDetailsToggle = screen.getByText(/View Details/i);
        fireEvent.click(viewDetailsToggle);

        await waitFor(() => {
            expect(screen.queryByText(/John Doe/i)).not.toBeInTheDocument();
        });
    });
}); 